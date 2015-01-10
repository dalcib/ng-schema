/* global getType */
'use strict';

xdescribe('getType function', function() {
  describe('should return a type', function() {

    it('when field type is a function', function() {
      expect(getType(String)).toBe('text');
      expect(getType(Number)).toBe('number');
      expect(getType(Date)).toBe('date');
      expect(getType(Boolean)).toBe('checkbox');
      //expect(getType(Schema.Types.ObjectId)).toBe('text');
    });

    it('when field type is a function', function() {
      expect(getType('text')).toBe('text');
      expect(getType('number')).toBe('number');
      expect(getType('date')).toBe('date');
      expect(getType('month')).toBe('month');
      expect(getType('time')).toBe('time');
      expect(getType('week')).toBe('week');
      expect(getType('checkbox')).toBe('checkbox');
      expect(getType('radio')).toBe('radio');
      expect(getType('email')).toBe('email');
      expect(getType('url')).toBe('url');
      expect(getType('search')).toBe('search');
      expect(getType('password')).toBe('password');
    });

    it('using default type', function() {
      //console.log('dsfdsf');
      expect(getType('dfgd')).toBe('text');
      expect(getType(null)).toBe('text');
      expect(getType(undefined)).toBe('text');
      expect(getType(Object)).toBe('text');
    });
  });
});
