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
          color: "#FA00DD",
          maxParticles: 150,
          connectParticles: false,
        },
      },
    ],
  });
};
