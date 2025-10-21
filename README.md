<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Your Name — Web Developer</title>
  <meta name="description" content="Portfolio of a web developer — projects, skills, and contact." />
  <link rel="stylesheet" href="css/style.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap" rel="stylesheet">
</head>
<body>
  <header class="site-header">
    <div class="container header-inner">
      <a class="logo" href="#">Your Name</a>
      <nav class="nav">
        <a href="#about">About</a>
        <a href="#projects">Projects</a>
        <a href="#skills">Skills</a>
        <a href="#contact" class="cta">Contact</a>
      </nav>
      <button class="nav-toggle" aria-label="Toggle navigation">☰</button>
    </div>
  </header>

  <main>
    <section class="hero">
      <div class="container hero-inner">
        <div class="hero-content">
          <h1>Hi, I'm Your Name</h1>
          <p class="lead">I build accessible, performant, and maintainable web applications.</p>
          <p>
            <a class="btn primary" href="#projects">See my work</a>
            <a class="btn" href="#contact">Let's talk</a>
          </p>
        </div>
        <div class="hero-image" aria-hidden="true">
          <div class="device-mock"></div>
        </div>
      </div>
    </section>

    <section id="about" class="section container">
      <h2>About</h2>
      <p>I’m a web developer focused on building delightful user experiences with modern web technologies. I enjoy working across the stack to ship products that solve real problems.</p>
    </section>

    <section id="projects" class="section container">
      <h2>Projects</h2>
      <div class="grid projects-grid">
        <article class="card">
          <h3>Project One</h3>
          <p>Short description of the project. Tech: React, Node.js</p>
          <p><a href="#" class="link">View project</a></p>
        </article>

        <article class="card">
          <h3>Project Two</h3>
          <p>Short description of the project. Tech: Next.js, Tailwind</p>
          <p><a href="#" class="link">View project</a></p>
        </article>

        <article class="card">
          <h3>Project Three</h3>
          <p>Short description of the project. Tech: Vanilla JS, HTML, CSS</p>
          <p><a href="#" class="link">View project</a></p>
        </article>
      </div>
    </section>

    <section id="skills" class="section container">
      <h2>Skills</h2>
      <ul class="skills-list">
        <li>JavaScript / TypeScript</li>
        <li>React / Next.js</li>
        <li>Node.js / Express</li>
        <li>HTML / CSS / Accessibility</li>
        <li>Testing / CI</li>
      </ul>
    </section>

    <section id="contact" class="section container contact-section">
      <h2>Contact</h2>
      <p>If you'd like to work together, send me a message.</p>
      <form class="contact-form" action="#" onsubmit="handleContact(event)">
        <div class="form-row">
          <input name="name" placeholder="Your name" required>
          <input name="email" placeholder="Email" type="email" required>
        </div>
        <textarea name="message" placeholder="Message" rows="5" required></textarea>
        <div class="form-actions">
          <button class="btn primary" type="submit">Send message</button>
        </div>
        <p class="form-status" aria-live="polite"></p>
      </form>
    </section>

  </main>

  <footer class="site-footer">
    <div class="container footer-inner">
      <p>© <span id="year"></span> Your Name — Built with care.</p>
      <div class="social">
        <a href="#" aria-label="GitHub">GitHub</a>
        <a href="#" aria-label="LinkedIn">LinkedIn</a>
      </div>
    </div>
  </footer>

  <script src="js/main.js"></script>
</body>
</html>
