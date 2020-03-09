import { normalizePath } from '../MakeAuthRoutes';

test('normalize path', () => {
  expect(normalizePath('test')).toEqual('test');
  expect(normalizePath('/test')).toEqual('/test');
  expect(normalizePath('/test/')).toEqual('/test');
  expect(normalizePath('/test//')).toEqual('/test/');
  expect(normalizePath('//test//')).toEqual('//test/');
});
