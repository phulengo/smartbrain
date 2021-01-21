import { Component } from "react";
import "./App.css";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import Logo from "./components/Logo/Logo";
import Navigation from "./components/Navigation/Navigation";
import Rank from "./components/Rank/Rank";
import Particles from "react-tsparticles";
import Clarifai from "clarifai";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import SignIn from "./components/SignIn/SignIn";
import Register from "./Register/Register";

const app = new Clarifai.App({
  apiKey: "7c8a350298ba429dbea0a0e1e8f686aa",
});

const particlesOptions = {
  fpsLimit: 60,
  interactivity: {
    detectsOn: "canvas",
    events: {
      onClick: {
        enable: true,
        mode: "push",
      },
      onHover: {
        enable: true,
        mode: "repulse",
      },
      resize: true,
    },
    modes: {
      bubble: {
        distance: 400,
        duration: 2,
        opacity: 0.8,
        size: 40,
      },
      push: {
        quantity: 4,
      },
      repulse: {
        distance: 200,
        duration: 0.4,
      },
    },
  },
  particles: {
    color: {
      value: "#ffffff",
    },
    links: {
      color: "#ffffff",
      distance: 150,
      enable: true,
      opacity: 0.5,
      width: 1,
    },
    collisions: {
      enable: true,
    },
    move: {
      direction: "none",
      enable: true,
      outMode: "bounce",
      random: false,
      speed: 6,
      straight: false,
    },
    number: {
      density: {
        enable: true,
        value_area: 800,
      },
      value: 100,
    },
    opacity: {
      value: 0.5,
    },
    shape: {
      type: "circle",
    },
    size: {
      random: true,
      value: 5,
    },
  },
  detectRetina: true,
};
class App extends Component {
  constructor() {
    super();
    this.state = {
      input: "",
      imageURL: "",
      boxes: [],
      route: "SignIn",
      isSignedIn: false,
      user: {
        id: "",
        name: "",
        email: "",
        entries: 0,
        joined: "",
      },
    };
  }

  loadUser = (data) => {
    this.setState({
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined,
      },
    });
  };

  componentDidMount() {
    fetch("http://localhost:3000").then((response) =>
      response.json().then((data) => console.log(data))
    );
  }

  calculateFaceLocation = (data) => {
    return data.outputs[0].data.regions.map((region) => {
      const clarifaiFace = region.region_info.bounding_box;
      const image = document.getElementById("inputImage");
      const width = Number(image.width);
      const height = Number(image.height);
      return {
        topRow: clarifaiFace.top_row * height,
        leftCol: clarifaiFace.left_col * width,
        bottomRow: height - clarifaiFace.bottom_row * height,
        rightCol: width - clarifaiFace.right_col * width,
      };
    });
  };

  displayFaceBox = (boxes) => {
    this.setState({ boxes: boxes });
  };

  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  };

  onButtonSubmit = (event) => {
    event.preventDefault();
    this.setState({ imageURL: this.state.input });
    app.models
      .predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
      .then((response) => {
        if (response) {
          fetch("http://localhost:3000/image", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: this.state.user.id,
            }),
          })
            .then((response) => response.json())
            .then((count) => {
              this.setState(Object.assign(this.state.user, { entries: count }));
            });
        }
        this.displayFaceBox(this.calculateFaceLocation(response));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  onRouteChange = (route) => {
    if (route === "Home") {
      this.setState({ isSignedIn: true });
    } else if (route === "SignOut") {
      this.setState({ isSignedIn: false });
    }
    this.setState({
      route: route,
    });
  };

  render() {
    const { imageURL, boxes, route, isSignedIn } = this.state; // Destructuring
    return (
      <div className="App">
        <Particles className="particles" options={particlesOptions} />
        <Navigation
          isSignedIn={isSignedIn}
          onRouteChange={this.onRouteChange}
        />
        {route === "Home" ? ( // Conditionally render components
          <div>
            <Logo />
            <Rank
              name={this.state.user.name}
              entries={this.state.user.entries}
            />
            <ImageLinkForm
              onInputChange={this.onInputChange}
              onButtonSubmit={this.onButtonSubmit}
            />
            <FaceRecognition boxes={boxes} imageURL={imageURL} />
          </div>
        ) : route === "SignIn" ? (
          <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
        ) : (
          <Register
            loadUser={this.loadUser}
            onRouteChange={this.onRouteChange}
          />
        )}
      </div>
    );
  }
}

export default App;
