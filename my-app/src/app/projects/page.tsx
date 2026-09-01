import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",
};

export default function Projects() {
  return (
    <div className="background-img">
      <div className="foreground">
        <h1>Projects</h1>
        <div className="item-box">
          <div>
            <h3>Baby Names Frequency Tracker</h3>
            <p className="boxTime">January 2023- April 2023</p>
            <p className="spaceBelow">
              In Software Design II, me and a group of four collaborated
              developed a user-friendly menu together, that allowed users to
              track names&apos; popularities across time and determine their
              ethnicities. This was implemented by normalizing CSV files to a
              standard format and converting them to Pandas data frames in
              Python. The image below displays the beginning of the project,
              when the program standardizes CSV files.
            </p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/babyNames.png"
              alt="Baby Names Image"
              className="boxImage"
              style={{ width: 400 }}
            />
          </div>
        </div>
        <div className="item-box">
          <div>
            <h3>Billards Pool Game Simulator</h3>
            <p className="boxTime">Jan 2024 - April 2024</p>
            <p className="spaceBelow">
              In CIS*2750, Software Systems Development and Integration, I
              programmed a C physic library to simulate billiards balls
              collisions, and then I integrated the program with a Python-based
              web server to dynamically generate SVG images onto an HTML
              website. The images below show where I was halfway through the
              project, as I just had two balls on the table with reasonable
              ball collisions.
            </p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/table-0.svg" alt="Table 0" className="boxImage" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/table-1.svg" alt="Table 1" className="boxImage" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/table-2.svg" alt="Table 2" className="boxImage" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/table-3.svg" alt="Table 3" className="boxImage" />
          </div>
        </div>
      </div>
    </div>
  );
}
