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

    function execute(event) {
        event.forEach(sub => sub.handler.call(sub.context));
    }

    return {

        /**
         * Подписаться на событие
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @returns {Object}
         */
        on: function (event, context, handler) {
            if (!Reflect.has(events, event)) {
                events[event] = [];
            }
            events[event].push({ context, handler });

            return this;
        },

        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         * @returns {Object}
         */
        off: function (event, context) {
            Object.keys(events)
                .filter(action => (action + '.').startsWith(event + '.'))
                .forEach(key => {
                    events[key] = events[key].filter(person => context !== person.context);
                });

            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} event
         * @returns {Object}
         */
        emit: function (event) {
            const len = event.split('.').length;
            let tempEvent = event;
            for (let i = 0; i < len; i++) {
                if (Reflect.has(events, tempEvent)) {
                    execute(events[tempEvent]);
                }
                tempEvent = tempEvent.substring(tempEvent.lastIndexOf('.'), -1);
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
         * @returns {Object}
         */
        several: function (event, context, handler, times) {
            this.on(event, context, times > 0
                ? () => times-- > 0 ? handler.call(context) : null : handler);

            return this;
        },

        /**
         * Подписаться на событие с ограничением по частоте получения уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} frequency – как часто уведомлять
         * @returns {Object}
         */
        through: function (event, context, handler, frequency) {
            let times = 0;
            this.on(event, context, frequency > 0
                ? () => times++ % frequency === 0 ? handler.call(context) : null : handler);

            return this;
        }
    };
}

