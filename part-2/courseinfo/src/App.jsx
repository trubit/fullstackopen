// Import the Course component so we can display each course and its parts.
import Course from "./Course.jsx";

// AppHeader is a small reusable component that shows a title.
const AppHeader = ({ name }) => {
  // Render the title passed in through the "name" prop.
  return <h1>{name}</h1>;
};

// App is the main component that holds the data and renders the page.
const App = () => {
  // "courses" is a list of course objects with names, ids, and parts.
  const courses = [
    {
      // First course object.
      name: "Half Stack application development",
      id: 1,
      // "parts" is a list of topics in this course.
      parts: [
        {
          // Each part has a name, number of exercises, and an id.
          name: "Fundamentals of React",
          exercises: 10,
          id: 1,
        },
        {
          // Each part has a name, number of exercises, and an id.
          name: "Using props to pass data",
          exercises: 7,
          id: 2,
        },
        {
          // Each part has a name, number of exercises, and an id.
          name: "State of a component",
          exercises: 14,
          id: 3,
        },
        {
          // Each part has a name, number of exercises, and an id.
          name: "Redux",
          exercises: 11,
          id: 4,
        },
      ],
    },
    {
      // Second course object.
      name: "Node.js",
      id: 2,
      // "parts" is a list of topics in this course.
      parts: [
        {
          // Each part has a name, number of exercises, and an id.
          name: "Routing",
          exercises: 3,
          id: 1,
        },
        {
          // Each part has a name, number of exercises, and an id.
          name: "Middlewares",
          exercises: 7,
          id: 2,
        },
      ],
    },
  ];

  return (
    <div>
      {/* Show the main page title */}
      <AppHeader name="Web development curriculum" />
      {/* Loop through all courses and render one Course component per course */}
      {courses.map((course) => (
        // "key" helps React track items in a list.
        <Course key={course.id} course={course} />
      ))}
    </div>
  );
};

// Export App so it can be used in other files (like main.jsx).
export default App;
