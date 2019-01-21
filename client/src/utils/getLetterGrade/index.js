const getLetterGrade = grade => {
  if (grade >= 9.5) {
    return 'A+';
  }
  if (grade >= 8.5) {
    return 'A';
  }
  if (grade >= 8.0) {
    return 'B+';
  }
  if (grade >= 7.0) {
    return 'B';
  }
  if (grade >= 6.5) {
    return 'C+';
  }
  if (grade >= 5.5) {
    return 'C';
  }
  if (grade >= 5.0) {
    return 'D+';
  }
  if (grade >= 4.0) {
    return 'D';
  }
  return 'F';
};

export { getLetterGrade };

export default getLetterGrade;
