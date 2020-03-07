const postsContainer = document.getElementById('posts-container');
const loading = document.querySelector('.loader');
const filter = document.getElementById('filter');

let limit = 10;
let page = 1;

// Fetch Posts from API
async function getPosts() {
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/posts?_limit=${limit}&_page=${page}`
  );
  const data = await res.json();
  return data;
}

// Show Posts in DOM
async function showPosts() {
  const posts = await getPosts();
  const postListTemplate = posts.reduce((html, post) => {
    return (
      html +
      `
      <div class="post">
        <div class="number">${post.id}</div>
        <div class="post-info">
          <h2 class="post-title">${post.title}</h2>
          <p class="post-body">
            ${post.body}
          </p>
        </div>
      </div>
    `
    );
  }, postsContainer.innerHTML);
  postsContainer.innerHTML = postListTemplate;
}

// Show Loading
async function showLoadingAndFetchAdditionalPosts() {
  loading.classList.add('show');
  page++;
  await showPosts();
  loading.classList.remove('show');
}

// Filter Posts
function filterPosts(e) {
  const term = e.target.value.toUpperCase();
  const posts = postsContainer.querySelectorAll('.post');
  posts.forEach(post => {
    const title = post.querySelector('.post-title').innerText.toUpperCase();
    const body = post.querySelector('.post-body').innerText.toUpperCase();
    if (title.includes(term) || body.includes(term)) {
      post.style.display = 'block';
    } else {
      post.style.display = 'none';
    }
  });
}

// add event listener
window.addEventListener('scroll', () => {
  // if (window.pageYOffset === window.innerHeight) {
  //   console.log('tick');
  // }
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  if (scrollTop + clientHeight === scrollHeight) {
    showLoadingAndFetchAdditionalPosts();
  }
});

filter.addEventListener('input', filterPosts);

// Show initial posts
showPosts();
