import React, { useState,useEffect } from 'react';

const FormLabel = (props) => {
    const { name,title } = props;

    return (
    <label for={name} class="" title={title} >{title}</label>
    );
};

export default FormLabel;
