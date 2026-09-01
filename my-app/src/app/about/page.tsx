import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Me",
};

export default function About() {
  return (
    <div className="background-img">
      <div className="foreground" style={{ textAlign: "center" }}>
        <h1>About Me</h1>
        <p className="item-box">
          My name is Daniel Dombrovsky. I am currently a student at the
          University of Guelph in the Bachelor of Computing program, majoring in
          Software Engineering with Co-op. I love being involved in my community
          by attending computing events, joining clubs, and meeting new people.
          My courses have refined my back-end development skills, which are
          complemented by the hands-on experience I gained in front-end
          development through my extracurriculars. I thrive at working in
          collaborative environments and creating innovative solutions to
          intricate problems.
        </p>
        <p className="item-box">
          Outside of university, I am interested in baking, I love trying new
          recipes I come across online and cooking family recipes at home. I
          love biking with my family and spending time outside during the
          Summer. I currently live in Cambridge and cannot wait to complete my
          degree to travel the world.
        </p>
        <div className="item-box">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/me.jpg"
            alt="Image of Me"
            style={{ width: 200, marginLeft: "auto", marginRight: "auto" }}
          />
          <p>This is a photo of me during the Fall 2023 semester.</p>
        </div>
        <p className="item-box">
          A fun fact about me is that I have previously broken my left leg, my
          right leg, and had a fingernail come off.
        </p>
      </div>
    </div>
  );
}
