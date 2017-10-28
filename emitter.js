'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
getEmitter.isStar = true;
module.exports = getEmitter;

/**
 * Возвращает новый emitter
 * @returns {Object}
 */
function getEmitter() {
    // let eventsTree = {
    //     children: {}
    // };
    let events = {};

    return {

        /**
         * Подписаться на событие
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @returns {on}
         */
        on: function (event, context, handler) {
            if (!events.hasOwnProperty(event + '.')) {
                events[event + '.'] = [];
            }
            events[event + '.'].push({ context, handler });
            // event.split('.').reduce((acc, subEvent) => {
            //     acc.nameSpaces.push(subEvent);
            //     if (!acc.tree.children.hasOwnProperty(subEvent)) {
            //         acc.tree.children[subEvent] = {
            //             subscribers: [],
            //             parentNameSpace: acc.tree,
            //             currentNameSpace: acc.nameSpaces.join('.'),
            //             children: {}
            //         };
            //     }
            //     acc.tree = acc.tree.children[subEvent];
            //
            //     return acc;
            // }, { tree: eventsTree, nameSpaces: [] }).tree.subscribers.push({ context, handler });

            return this;
        },

        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         * @returns {off}
         */
        off: function (event, context) {
            Object.keys(events).filter(key => (key).startsWith(event + '.'))
                .forEach(key => {
                    events[key].forEach((sub, i, arr) => {
                        if (sub.context === context) {
                            arr.splice(i, 1);
                        }
                    });
                });
            // const childQueue = [];
            // childQueue.push(getLevelContext(event, eventsTree));
            // while (childQueue.length > 0) {
            //     const child = childQueue.pop();
            //     for (let key of Object.keys(child.children)) {
            //         childQueue.push(child.children[key]);
            //     }
            //     deleteEntries(child, context);
            // }

            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} event
         * @returns {emit}
         */
        emit: function (event) {
            const len1 = event.split('.').length;
            for (let i = 0; i < len1; i++) {
                if (events.hasOwnProperty(event + '.')) {
                    execute(events[event + '.']);
                }
                event = event.split('.')
                    .slice(0, -1)
                    .join('.');
            }
            // let levelContext = getLevelContext(event, eventsTree);
            // const len = event.split('.').length;
            // for (let i = 0; i < len; i++) {
            //     if (levelContext.currentNameSpace === event) {
            //         executeEvent(levelContext);
            //         levelContext = levelContext.parentNameSpace;
            //     }
            //     event = event.split('.')
            //         .slice(0, -1)
            //         .join('.');
            // }

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

function execute(event) {
    event.forEach(sub => {
        sub.handler.call(sub.context);
    });
}

// function executeEvent(levelContext) {
//     if (levelContext.hasOwnProperty('subscribers')) {
//         levelContext.subscribers.forEach(sub => {
//             sub.handler.call(sub.context);
//         });
//     }
//
// }

// function getLevelContext(event, events) {
//     return event.split('.').reduce((acc, subEvent) => {
//         if (acc.children.hasOwnProperty(subEvent)) {
//             acc = acc.children[subEvent];
//         }
//
//         return acc;
//     }, events);
// }

// function deleteEntries(child, context) {
//     for (let i = 0; i < child.subscribers.length; i++) {
//         if (child.subscribers[i].context === context) {
//             child.subscribers.splice(i, 1);
//         }
//     }
// }
