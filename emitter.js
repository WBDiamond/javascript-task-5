'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
getEmitter.isStar = false;
module.exports = getEmitter;

/**
 * Возвращает новый emitter
 * @returns {Object}
 */
function getEmitter() {
    let events = {
        currentNameSpace: 'root',
        children: {}
    };

    return {

        /**
         * Подписаться на событие
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @returns {on}
         */
        on: function (event, context, handler) {
            context[event] = handler;
            event.split('.').reduce((acc, subEvent) => {
                if (!acc.children.hasOwnProperty(subEvent)) {
                    acc.children[subEvent] = {
                        subscribers: [],
                        parentNameSpace: acc,
                        currentNameSpace: subEvent,
                        children: {}
                    };
                }
                acc = acc.children[subEvent];

                return acc;
            }, events).subscribers.push(context);

            return this;
        },

        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         * @returns {off}
         */
        off: function (event, context) {

            const levelContext = getLevelContext(event, events);
            const index = levelContext.subscribers.indexOf(context);
            const childQueue = [].push(levelContext.subscribers.splice(index, 1));
            while (childQueue.length > 0) {
                const child = childQueue.pop();
                for (let key of Object.keys(child.children)) {
                    childQueue.push(child.children[key]);
                }
                const tempIndex = child.subscribers.indexOf(context);
                child.subscribers.splice(tempIndex, 1);
            }

            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} event
         * @returns {emit}
         */
        emit: function (event) {
            let levelContext = getLevelContext(event, events);
            while (levelContext.currentNameSpace !== 'root') {
                if (executeSubs(levelContext, event)) {
                    levelContext = levelContext.parentNameSpace;
                }
                event = event.split('.')
                    .slice(0, -1)
                    .join('.');
            }

            return this;
        }

        /**
         * Подписаться на событие с ограничением по количеству полученных уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} times – сколько раз получить уведомление
         * @returns {several}
         */
        // several: function (event, context, handler, times) {
        //     // console.info(event, context, handler, times);
        //     let levelContext = getLevelContext(event, events);
        //
        //
        //     return this;
        // },

        /**
         * Подписаться на событие с ограничением по частоте получения уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} frequency – как часто уведомлять
         * @returns {through}
         */
        // through: function (event, context, handler, frequency) {
        //     // console.info(event, context, handler, frequency);
        //
        //     return this;
        // }
    };
}

function executeSubs(levelContext, event) {
    let eventExists = false;
    levelContext.subscribers.forEach(sub => {
        if (sub.hasOwnProperty(event)) {
            // if ()
            sub[event]();
            eventExists = true;
        }
    });

    return eventExists;
}

function getLevelContext(event, events) {
    return event.split('.').reduce((acc, subEvent) => {
        if (acc.children.hasOwnProperty(subEvent)) {
            acc = acc.children[subEvent];
        }

        return acc;
    }, events);
}
