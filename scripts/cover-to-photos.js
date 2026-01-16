'use strict';

hexo.extend.filter.register('before_generate', () => {
  const posts = hexo.locals.get('posts');
  if (!posts) return;

  const list = typeof posts.toArray === 'function' ? posts.toArray() : posts;
  if (!list || typeof list.forEach !== 'function') return;

  list.forEach(post => {
    if (Array.isArray(post.photos) && post.photos.length) return;

    const cover = post.cover;
    if (!cover || cover === false) return;

    if (Array.isArray(cover)) {
      post.photos = cover;
      return;
    }

    if (typeof cover === 'string') {
      post.photos = [cover];
    }
  });
});
