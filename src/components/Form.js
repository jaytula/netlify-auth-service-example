import React, { useState } from "react";
import PropTypes from "prop-types";

const Form = ({ onSubmit, title, inputs }) => {
  const [input, setInput] = useState({});
  const [loading, setLoading] = useState(false);

  const submitHandler = async e => {
    e.preventDefault();

    setLoading(true);
    const response = await onSubmit(input);
    if(!response.ok) setLoading(false);
  };

  return (
    <>
      <h3>{title}</h3>
      <form onSubmit={submitHandler}>
        <fieldset disabled={loading} aria-busy={loading}>
          {inputs.map(i => (
            <label key={i.name}>
              {i.name}
              <input
                value={input[i.name] || ""}
                type={i.type}
                onChange={e => {
                  const value = e.target.value;
                  setInput(prev => ({ ...prev, [i.name]: value }));
                }}
              />
            </label>
          ))}
          <input type="submit" value={`Submit${loading ? "ting" : ""}`} />
        </fieldset>
      </form>
    </>
  );
};

Form.propTypes = {
  title: PropTypes.string.isRequired,
  inputs: PropTypes.arrayOf(
    PropTypes.shape(
      {
        name: PropTypes.string.isRequired,
        type: PropTypes.string,
      }.isRequired
    )
  ),
  onSubmit: PropTypes.func.isRequired,
};

export { Form };
