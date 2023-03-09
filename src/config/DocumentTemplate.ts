export default {
  dataTypes: [{
    label: "String",
    value: "string",
  }, {
    label: "Number",
    value: "number",
  }, {
    label: "Date",
    value: "datetime",
  }, {
    label: "File",
    value: "file",
  }],

  inputTypes: [{
    label: "Number Input",
    value: "numberInput",
  }, {
    label: "Text Input",
    value: "textInput",
  }, {
    label: "Date Time Input",
    value: "dateTimeInput",
  }, {
    label: "Select Input",
    value: "selectInput",
  }, {
    label: "File Input",
    value: "fileInput",
  }, {
    label: "Text Area",
    value: "textAreaInput",
  },{
    label: "Checkbox",
    value: "checkboxInput",
  },{
    label: "Radio",
    value: "radioInput",
  },{
    label: "Date Range",
    value: "dateTimeShowTimeInput",
  },{
    label: "Input Table",
    value: "tableInput",
  }],

  validations: {
    textInput: [
      {
        label: "Required",
        value: "required",
      },
      {
        label: "Whitespace",
        value: "whitespace",
      },
      {
        label: "Is Email",
        value: "email",
      },
    ],
    numberInput: [{
      label: "Required",
      value: "required",
    },{
      label: "Max Number",
      value: "max",
    }],
    dateTimeInput: [{
      label: "Required",
      value: "required",
    },],
    selectInput: [{
      label: "Required",
      value: "required",
    },],
    fileInput: [{
      label: "Required",
      value: "required",
    },
    {
      label: "Type File Upload",
      value: "type_file_upload",
    },
    {
      label: "Size File Upload",
      value: "size_file_upload",
    },
    {
      label: "Number File Upload",
      value: "number_file_upload",
    },],
    textAreaInput: [
      {
        label: "Required",
        value: "required",
      },
      {
        label: "Whitespace",
        value: "whitespace",
      },
      {
        label: "Max",
        value: "max",
      },
    ],
    checkboxInput: [{
      label: "Required",
      value: "required",
    },],
    radioInput: [{
      label: "Required",
      value: "required",
    }],
    dateTimeShowTimeInput: [{
      label: "Required",
      value: "required",
    }],
    tableInput: [{
      label: "Required",
      value: "required",
    },{
      label: "Is Email",
      value: "email",
    },{
      label: "Whitespace",
      value: "whitespace",
    },]
  },

  listSourceTypes : ["database", "manual"],

  documentStatus : {
    1: 'Draft',
    2: 'Submitted',
    3: 'In Progress',
    4: 'Rejected',
    5: 'Approve',
  },

  documentStatusFollowArray : {
    'Cancelled':"Personal Health",
    'Submitted':"Company Detals",
    'Draft': "Your Detals"
  },


  documentArrayStatus : ["Your Detals","Company Detals","Personal Health"],

  stateForm : ['Draft', 'BSEZ Employee', 'BSEZ Admin', 'Done'],

  documentStatusColor : {
    1: '#1890ff',
    2: 'blue',
    3: 'yellow',
    4: 'red',
    5: 'green',

  }
};
