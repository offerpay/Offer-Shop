import type { Metadata } from "next"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Careers | TechStyle",
  description: "Join our team at TechStyle and help shape the future of tech and style.",
}

const openPositions = [
  {
    title: "Product Photographer",
    department: "Creative",
    location: "New York, NY",
    type: "Full-time",
  },
  {
    title: "E-commerce Manager",
    department: "Marketing",
    location: "Remote",
    type: "Full-time",
  },
  {
    title: "Customer Support Specialist",
    department: "Operations",
    location: "Los Angeles, CA",
    type: "Full-time",
  },
  {
    title: "Content Writer",
    department: "Marketing",
    location: "Remote",
    type: "Part-time",
  },
]

export default function CareersPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Join Our Team</h1>

        <div className="prose prose-neutral max-w-none mb-12">
          <p>
            At TechStyle, we're passionate about bringing the best cameras, bags, and accessories to our customers.
            We're always looking for talented individuals who share our passion for technology and style to join our
            growing team.
          </p>

          <h2>Why Work With Us?</h2>
          <ul>
            <li>
              <strong>Innovation:</strong> We're constantly pushing the boundaries of what's possible in our industry.
            </li>
            <li>
              <strong>Growth:</strong> We offer numerous opportunities for professional development and career
              advancement.
            </li>
            <li>
              <strong>Culture:</strong> We foster a collaborative, inclusive, and supportive work environment.
            </li>
            <li>
              <strong>Benefits:</strong> We offer competitive salaries, health insurance, paid time off, and more.
            </li>
          </ul>
        </div>

        <h2 className="text-2xl font-bold mb-6">Open Positions</h2>

        <div className="space-y-4 mb-12">
          {openPositions.map((position, index) => (
            <div key={index} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold mb-2">{position.title}</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-neutral-100 px-3 py-1 rounded-full text-sm">{position.department}</span>
                <span className="bg-neutral-100 px-3 py-1 rounded-full text-sm">{position.location}</span>
                <span className="bg-neutral-100 px-3 py-1 rounded-full text-sm">{position.type}</span>
              </div>
              <Button>Apply Now</Button>
            </div>
          ))}
        </div>

        <div className="bg-neutral-50 p-6 rounded-lg text-center">
          <h3 className="text-xl font-bold mb-2">Don't see a position that fits your skills?</h3>
          <p className="mb-4">
            We're always interested in connecting with talented individuals. Send us your resume and we'll keep you in
            mind for future opportunities.
          </p>
          <Button variant="outline">Send Your Resume</Button>
        </div>
      </div>
    </div>
  )
}
