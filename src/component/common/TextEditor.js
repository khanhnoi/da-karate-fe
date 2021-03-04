/* eslint-disable no-unused-vars */
/* eslint-disable react/display-name */
import React from 'react';
import PropTypes from 'prop-types';
import { checkError, getError } from '../../helpers/error';
import Alert from './Alert';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const TextEditor = React.forwardRef((props, ref) => {
  let { errors, ...input } = props;
  return (
    <div className={checkError(errors, input.name)}>
      {input.label && <label className="input-label">{input.label}</label>}
      <CKEditor
        {...input}
        editor={ClassicEditor}
      />
      <Alert messsage={getError(errors, input.name)} />
    </div>
  );
});

export default TextEditor;

TextEditor.propTypes = {
  errors: PropTypes.isRequired,
  input: PropTypes.isRequired
};
