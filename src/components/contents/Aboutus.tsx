import React from "react";

function AboutUs() {
  return (
    <div className="bg-muted text-foreground py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight leading-tight">
            About InnMate
          </h1>
          <p className="mt-4 text-muted-foreground">
            InnMate is your gateway to a world of unique stays, offering a wide variety of properties hosted by passionate individuals from across the globe. Discover how we connect travelers with exceptional accommodations and experiences.
          </p>
        </div>

        {/* Platform Introduction Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold">Our Story</h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Founded with a mission to make travel more accessible and personal, InnMate brings together a diverse selection of properties hosted by people who love sharing their spaces and cultures. From cozy apartments to luxury resorts, we provide travelers with authentic stays and memorable experiences wherever they go.
          </p>
        </section>

        {/* Unique Features Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold">Why Choose InnMate?</h2>
          <ul className="mt-4 space-y-4 text-muted-foreground">
            <li>
              <span className="font-semibold">Wide Selection of Properties:</span> Find stays that match your style and budget, hosted by locals who know the area best.
            </li>
            <li>
              <span className="font-semibold">Personalized Experiences:</span> Connect with hosts who offer a personal touch, making each stay unique and tailored to you.
            </li>
            <li>
              <span className="font-semibold">Seamless Booking:</span> Our platform makes it easy to book, communicate with hosts, and get recommendations for a memorable trip.
            </li>
            <li>
              <span className="font-semibold">Secure & Trusted:</span> We prioritize security, with a system designed to keep both guests and hosts safe and supported.
            </li>
          </ul>
        </section>

        {/* Mission and Values Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold">Our Mission & Values</h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            At InnMate, our mission is to connect people through travel, providing spaces that inspire and foster genuine connections. Our values are the foundation of our community:
          </p>
          <ul className="mt-4 space-y-2 text-muted-foreground">
            <li><span className="font-semibold">Community:</span> We build connections between travelers and hosts, creating a global community of explorers.</li>
            <li><span className="font-semibold">Authenticity:</span> Each listing reflects the unique personality and culture of its host.</li>
            <li><span className="font-semibold">Inclusivity:</span> We believe in welcoming everyone to discover and share their stories.</li>
            <li><span className="font-semibold">Sustainability:</span> We encourage sustainable travel practices to help protect our planet.</li>
          </ul>
        </section>
      </div>
    </div>
  );
}

export default AboutUs;
