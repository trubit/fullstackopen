// CourseHeader shows the course title.
const CourseHeader = ({ name }) => {
  // Render the course name inside an h2 heading.
  return <h2>{name}</h2>;
};

// Part shows one topic and its exercise count.
const Part = ({ name, exercises }) => {
  return (
    <p>
      {/* Show the part name followed by the number of exercises */}
      {name} {exercises}
    </p>
  );
};

// Content renders a list of all parts in the course.
const Content = ({ parts }) => {
  return (
    <div>
      {/* Loop through parts and render a Part component for each one */}
      {parts.map((part) => (
        // "key" helps React keep track of items in a list.
        <Part key={part.id} name={part.name} exercises={part.exercises} />
      ))}
    </div>
  );
};

// Total calculates and shows the sum of all exercises.
const Total = ({ parts }) => {
  // Add up the exercises from every part to get a total.
  const total = parts.reduce((sum, part) => sum + part.exercises, 0);
  // Show the final total below the list of parts.
  return <p>total of {total} exercises</p>;
};

// Course combines header, content, and total for one course.
const Course = ({ course }) => {
  return (
    <div>
      {/* Show the course title */}
      <CourseHeader name={course.name} />
      {/* Show all parts for this course */}
      <Content parts={course.parts} />
      {/* Show the total number of exercises */}
      <Total parts={course.parts} />
    </div>
  );
};

// Export Course so other files can use it.
export default Course;
