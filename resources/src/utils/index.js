/**
 * Require validate
 * @param val
 * @returns {boolean}
 */

export const required = (val) => {
  return val && val.trim() && val.length;
};

/**
 * Url validate
 * @param value
 * @returns {boolean}
 */

export const isUrl = (value) => {
  return value && /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/.test(value);
};


export const maxLength = (threshold) => {
  return (value) => {
    return value.length < threshold;
  };
};

export const getCookie = (name) => {
  const matches = document.cookie.match(new RegExp(
    '(?:^|; )' + name.replace(/([.$?*|{}()[]\\\/+^])/g, '\\$1') + '=([^;]*)'
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
};
