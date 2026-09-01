import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Experience",
};

export default function Experience() {
  return (
    <div className="background-img">
      <div className="foreground">
        <h1>Experience</h1>
        <div className="item-box">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/socisLogo.png"
            alt="Society of Computing and Information Science - University of Guelph Logo"
            className="boxImage"
          />
          <div>
            <h3>SOCIS President</h3>
            <p className="boxTime">Dec 2023 - Present</p>
            <p className="spaceBelow">Guelph, Ontario, Canada</p>
            <p className="spaceBelow">
              I took over as the president of the Society of Computing and
              Informational Science during a chaotic time for the club and I
              began rebuilding the club. I led the executive team to success by
              organizing meetings, meticulously planning out the budget, and
              advocating for computing students at faculty curriculum meetings.
              The club also launched brand new computing merch to represent
              Guelph Computing, which was very popular with students. Below
            </p>
            <p className="spaceBelow">
              Some of our most successful events for the club were:
            </p>
            <ul>
              <li>Study Night (50 people)</li>
              <li>Games Night (60 people)</li>
              <li>Coding Competition (75 people)</li>
            </ul>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/group.jpg"
              alt="Image of computing community"
              style={{ width: 300 }}
            />
            <p>
              The above image is a group picture of all the computing leaders
              coming together at the SOCIS Election Social event to welcome the
              newcomers.
            </p>
          </div>
        </div>
        <div className="item-box">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/gdscLogo.png"
            alt="Google Developer Student Club | UofG Logo"
            className="boxImage"
          />
          <div>
            <h3>GDSC Marketing and Publicity Director</h3>
            <p className="boxTime">Sep 2023 - Present</p>
            <p className="spaceBelow">Guelph, Ontario, Canada</p>
            <p className="spaceBelow">
              In this role, I marketed the Google Developer Student Club
              workshops and managed the club&apos;s social media presence. I
              planned and executed large-scale events of up to 120 people,
              teaching the basics of web development to guide students to
              develop websites with digital grocery lists and other website
              elements. Additionally, I volunteered at Google DevFest Waterloo
              2023, working with Google employees to organize an event with an
              attendance of over 300 participants.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
