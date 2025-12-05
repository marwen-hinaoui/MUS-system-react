import { Input } from "antd";

const normalizeSpaces = (str) => str.replace(/\s+/g, "    ").trim();

export const PatchedInput = (props) => {
  const handleChange = (e) => {
    const cleaned = normalizeSpaces(e.target.value);
    props.onChange?.({
      ...e,
      target: { ...e.target, value: cleaned },
    });
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text");
    const cleaned = normalizeSpaces(pasted);

    props.onChange?.({
      ...e,
      target: { ...e.target, value: cleaned },
    });
  };

  return <Input {...props} onChange={handleChange} onPaste={handlePaste} />;
};
