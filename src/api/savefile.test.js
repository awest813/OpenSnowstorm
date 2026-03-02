import { path_name } from './savefile';

describe('path_name', () => {
  it('returns the base name from a Unix-like path', () => {
    expect(path_name('path/to/file.txt')).toBe('file.txt');
  });

  it('returns the base name from a Windows-like path', () => {
    expect(path_name('path\\to\\file.txt')).toBe('file.txt');
  });

  it('handles paths with mixed slashes', () => {
    expect(path_name('path/to\\file.txt')).toBe('file.txt');
    expect(path_name('path\\to/file.txt')).toBe('file.txt');
  });

  it('returns the same string if there are no slashes', () => {
    expect(path_name('file.txt')).toBe('file.txt');
  });

  it('returns an empty string if the path ends with a slash', () => {
    expect(path_name('path/to/dir/')).toBe('');
    expect(path_name('path\\to\\dir\\')).toBe('');
  });

  it('returns an empty string if the input is an empty string', () => {
    expect(path_name('')).toBe('');
  });
});
