// Loading particle effects
window.onload = function () {
  Particles.init({
    selector: ".background",
    color: ["#FAFAFA", "#FF0011"],
    maxParticles: 250,
    connectParticles: true,
    responsive: [
      {
        breakpoint: 800,
        options: {
          color: "#FAF00DD",
          maxParticles: 150,
          connectParticles: false,
        },
      },
    ],
  });
};
