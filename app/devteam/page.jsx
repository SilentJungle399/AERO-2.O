import Image from "next/image";

const teamMembers = [
  {
    name: "Prayatna Kishan",
    role: "Frontend Developer",
    imageUrl: "/paryatna.jpg",
    bio: "B.Tech Mechanical Engineering graduate, is passionate about integrating engineering with emerging technologies, making impactful contributions in the tech space.",
  },
  {
    name: "Mayank Saini",
    role: "Full Stack",
    imageUrl: "/dev4.png",
    bio: " B.Tech Computer Engineering graduate, secured a PPO at Microsoft, showcasing their expertise in coding and innovative problem-solving.",
  },
  {
    name: "Jay Kumar Gupta",
    role: "Backend Developer",
    imageUrl: "/dev1.png",
    bio: "Prefinal year Computer Engineering student at NIT Kurukshetra, fueled by a passion for development and curious about the latest in emerging technologies.",
  },
  {
    name: "Divyanshu Tungriya",
    role: "Frontend Developer",
    imageUrl: "/dev2.jpg",
    bio: "B.Tech student in Computer Engineering at NIT Kurukshetra, passionate about WebDev and emerging tech.",
  },
];

const contentMembers = [
  {
    name: "Sachin kamboj",
    role: "Content Writer",
    imageUrl: "/sachin.jpg",
  },
  {
    name: "Abhimanyu Mittal",
    role: "Content Writer",
    imageUrl: "/abhi.jpg",
  },
  {
    name: "Akash Jindhar",
    role: "Designer",
    imageUrl: "/akash.png",
  },
  {
    name: "Abhishek ",
    role: "Designer",
    imageUrl: "/abhishek.jpg",
  },

  {
    name: "Varnika Chauhan",
    role: "Content Writer",
    imageUrl: "/var.jpg",
  },
  {
    name: "Kaushiki Vashisth",
    role: "Content Writer",
    imageUrl: "/kaus.jpg",
  },
  {
    name: "Kushagra",
    role: "Photo Editor",
    imageUrl: "/kushagra.png",
  },
  {
    name: "Janhvi Singh",
    role: "Video Editor",
    imageUrl: "/cont6.jpg",
  },
];

export default function DevTeam() {
  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <div className="container mx-auto  py-24">
        <h1 className="text-4xl font-bold text-blue-400 text-center mb-16">
          Meet Our Dev Team
        </h1>
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {teamMembers.map((member) => (
            <div
              key={member.name}
              className="bg-gray-800 p-6 rounded-lg shadow-lg transition-transform hover:scale-105"
            >
              <div className="mb-6 relative w-48 h-48 mx-auto">
                <Image
                  src={member.imageUrl}
                  alt={member.name}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-full"
                />
              </div>
              <h2 className="text-2xl font-bold text-blue-300 text-center mb-2">
                {member.name}
              </h2>
              <p className="text-lg text-center mb-4 text-gray-300">
                {member.role}
              </p>
              <p className="text-center text-gray-400 text-sm">{member.bio}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-blue-400 text-center mb-16">
          Meet Our Content Team
        </h1>
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {contentMembers.map((member) => (
            <div
              key={member.name}
              className="bg-gray-800 p-6 rounded-lg shadow-lg transition-transform hover:scale-105"
            >
              <div className="mb-6 relative w-48 h-48 mx-auto">
                <Image
                  src={member.imageUrl}
                  alt={member.name}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-full"
                />
              </div>
              <h2 className="text-2xl font-bold text-blue-300 text-center mb-2">
                {member.name}
              </h2>
              <p className="text-lg text-center mb-4 text-gray-300">
                {member.role}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
