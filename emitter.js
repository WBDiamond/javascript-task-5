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
            if (!events.hasOwnProperty(event)) {
                events[event] = [];
            }
            events[event].push({ context, handler });

            return this;
        },

        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         * @returns {off}
         */
        off: function (event, context) {
            Object.keys(events).filter(eventFilter)
                .forEach(unsub);

            return this;

            function eventFilter(action) {
                return (action + '.').startsWith(event + '.');
            }

            function unsub(action) {
                events[action].forEach((subscriber, i) => {
                    if (subscriber.context === context) {
                        events[action].splice(i, 1);
                    }
                });
            }
        },

        /**
         * Уведомить о событии
         * @param {String} event
         * @returns {emit}
         */
        emit: function (event) {
            const len = event.split('.').length;
            for (let i = 0; i < len; i++) {
                if (events.hasOwnProperty(event)) {
                    execute(events[event]);
                }
                event = event.substring(event.lastIndexOf('.'), -1);
            }

            return this;
        },

        /**
         * Подписаться на событие с ограничением по количеству полученных уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} times – сколько раз получить уведомление
         * @returns {several}
         */
        several: function (event, context, handler, times) {
            this.on(event, context, () => times-- > 0 ? handler.call(context) : null);

            return this;
        },

        /**
         * Подписаться на событие с ограничением по частоте получения уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} frequency – как часто уведомлять
         * @returns {through}
         */
        through: function (event, context, handler, frequency) {
            let times = 0;
            this.on(event, context, () => times++ % frequency === 0 ? handler.call(context) : null);

            return this;
        }
    };
}

function execute(event) {
    event.forEach(sub => sub.handler.call(sub.context));
}

