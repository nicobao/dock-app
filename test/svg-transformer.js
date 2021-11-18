module.exports = {
  process(src, filePath) {
    if (filePath.indexOf('.svg') > -1) {
      return `
const React = require('react');
function SvgFile(props) {
return React.createElement(
  'svg', 
  Object.assign({}, props, {'data-file-name': ""})
);
}
module.exports = SvgFile;
          `;
    } else {
      return src;
    }
  },
};
