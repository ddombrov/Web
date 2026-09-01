export default function Footer() {
  return (
    <footer>
      <h2 className="footerHeader">Contact Me:</h2>
      <p>Feel free to check out my Github, Linkedin, or send me an email.</p>
      <a className="fa fa-github" style={{ fontSize: 36 }} href="https://github.com/ddombrov" />
      <a
        className="fa fa-linkedin"
        style={{ fontSize: 36 }}
        href="https://www.linkedin.com/in/daniel-dombrovsky-9d/"
      />
      <a className="fa fa-envelope" style={{ fontSize: 36 }} href="mailto:ddombrov@uoguelph.ca" />
    </footer>
  );
}
