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
    let eventsTree = {
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
                        currentNameSpace: event,
                        children: {}
                    };
                }
                acc = acc.children[subEvent];

                return acc;
            }, eventsTree).subscribers.push(context);

            return this;
        },

        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         * @returns {off}
         */
        off: function (event, context) {
            const childQueue = [];
            childQueue.push(getLevelContext(event, eventsTree));
            while (childQueue.length > 0) {
                const child = childQueue.pop();
                for (let key of Object.keys(child.children)) {
                    childQueue.push(child.children[key]);
                }
                const tempIndex = child.subscribers.indexOf(context);
                delete child.subscribers.splice(tempIndex, 1)[0][child.currentNameSpace];
            }

            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} event
         * @returns {emit}
         */
        emit: function (event) {
            let levelContext = getLevelContext(event, eventsTree);
            const len = event.split('.').length;
            for (let i = 0; i < len; i++) {
                if (executeEvent(levelContext, event)) {
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
        //     let levelContext = getLevelContext(event, eventsTree);
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

function executeEvent(levelContext, event) {
    let eventExists = false;
    if (levelContext.hasOwnProperty('subscribers')) {
        levelContext.subscribers.forEach(sub => {
            if (sub.hasOwnProperty(event)) {
                // if ()
                sub[event]();
                eventExists = true;
            }
        });
    }

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
