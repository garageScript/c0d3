// eslint-disable-next-line no-extend-native
Object.defineProperty(Object.prototype, 'gsLength', {
  value: function() {
    return Object.keys(this).length;
  },
  enumerable: false,
  configurable: true
});
