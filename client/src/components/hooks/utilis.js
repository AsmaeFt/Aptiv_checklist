export const toogle = (prev, at) => ({
    ...prev,
    [at]: !prev[at],
  });