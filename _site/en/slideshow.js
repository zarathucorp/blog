let posts = [];
let currentSlide = 0;

function createSlide(post) {
  const slide = document.createElement('div');
  slide.classList.add('slide');

  const author = Array.isArray(post.author) ? post.author[0] : post.author || {};
  const authorName = author.name || 'Unknown';
  const authorUrl = author.url || '#';
  const postUrl = './' + (post.path || '#');

  slide.innerHTML = `
    <a href="${postUrl}" target="_blank" class="slide-link">
      <div class="slide-content">
        <h2>${post.title}</h2>
        <p><strong>Date:</strong> ${post.date}</p>
        <p>${post.description}</p>
      </div>
    </a>
  `;

  return slide;
}

function showSlide(index) {
  const container = document.getElementById('slideshow');

  // If it's the first time, create all slides once
  if (container.children.length !== posts.length) {
    container.innerHTML = '';
    posts.forEach((post, i) => {
      const slide = createSlide(post);
      slide.classList.add('slide');
      if (i === index) slide.classList.add('active');
      container.appendChild(slide);
    });
  } else {
    // Remove .active from all slides, add it only to current
    Array.from(container.children).forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });
  }
}

function changeSlide(direction) {
  if (!posts.length) return;
  currentSlide = (currentSlide + direction + posts.length) % posts.length;
  showSlide(currentSlide);
}

async function loadPosts() {
  try {
    const response = await fetch('posts.json');
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    let data = await response.json();

    data.sort((a, b) => new Date(b.date) - new Date(a.date));
    posts = data.slice(0, 5);

    if (posts.length > 0) {
      currentSlide = 0;
      showSlide(currentSlide);

      setInterval(() => {
        changeSlide(1);
      }, 3500);
    } else {
      document.getElementById('slideshow').innerHTML = 'No posts available.';
    }
  } catch (error) {
    document.getElementById('slideshow').innerHTML = 'Failed to load slideshow.';
    console.error('Error:', error);
  }
}

document.addEventListener('DOMContentLoaded', loadPosts);
