import { normalizePath } from '../AuthRoutes';

test('normalize path', () => {
  expect(normalizePath('test')).toEqual('test');
  expect(normalizePath('/test')).toEqual('/test');
  expect(normalizePath('/test/')).toEqual('/test');
  expect(normalizePath('/test//')).toEqual('/test/');
  expect(normalizePath('//test//')).toEqual('//test/');
});
