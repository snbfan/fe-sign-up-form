export const generateControlObject = (value, enableSpy = false) => {
  let setErrorsSpy;

  const controlObjectGetMock = {
    value: undefined,
    errors: null,
    setErrors: () => {}
  };

  if (enableSpy) {
    setErrorsSpy = spyOn(controlObjectGetMock, 'setErrors').and.returnValue(undefined);
  }

  const control = {
    get: (field) => {
      controlObjectGetMock.value = value[field];
      return controlObjectGetMock;
    }
  };

  return {
    control,
    spyObject: setErrorsSpy
  };
};
