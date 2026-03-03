(function() {
  const USERNAME = 'yourname';      // 改成你的用户名
  const REPO = 'myblog';             // 改成你的仓库名
  const BRANCH = 'main';             // 改成你的默认分支

  const images = document.querySelectorAll('img');
  images.forEach(img => {
    const originalSrc = img.getAttribute('src');
    if (!originalSrc || originalSrc.includes('cdn.jsdelivr.net')) return;

    let rawGithubSrc;
    if (originalSrc.startsWith('http')) {
      // 已经是绝对路径，尝试提取 GitHub 原始地址
      if (originalSrc.includes('githubusercontent.com') || originalSrc.includes('github.com')) {
        rawGithubSrc = originalSrc;
      } else {
        return; // 不是 GitHub 图片，不处理
      }
    } else {
      // 相对路径：假设相对于仓库根目录（以 / 开头）
      // 如果你的 HTML 在子目录，需要调整这里的拼接方式
      const cleanPath = originalSrc.replace(/^\.\//, ''); // 去掉开头的 ./
      rawGithubSrc = `https://raw.githubusercontent.com/${USERNAME}/${REPO}/${BRANCH}/${cleanPath}`;
    }

    // 转换为 jsDelivr 链接
    const cdnSrc = rawGithubSrc.replace(
      /https?:\/\/(raw\.githubusercontent\.com|github\.com\/raw)\/[^\/]+\/[^\/]+\/[^\/]+\/(.*)/,
      `https://cdn.jsdelivr.net/gh/${USERNAME}/${REPO}@${BRANCH}/$2`
    );

    // 如果替换失败（正则不匹配），则跳过
    if (cdnSrc === rawGithubSrc) return;

    img.onerror = function() {
      console.warn('CDN 加载失败，回退到原始地址', rawGithubSrc);
      img.src = rawGithubSrc;
      img.onerror = null;
    };
    img.src = cdnSrc;
  });
})();