import { useState, useMemo } from 'react';
import { TextInput, SelectInput, CheckboxInput, PasswordInput, PhoneInput } from '../../components/input';
import { DraggableList, Draggable, DragIcon } from '../../components/draggable';
import { useFormEngine, useFormUi } from '../../service/hooks';
import { PrimaryButton } from "../../components/cta";
import services from '../../service';

const DEFAULT_SCHEMA = {
  name: {
    id: "name",
    label: "Name",
    type: "text",
    placeholder: "John Doe",
    keyboardType: "text",
    isRequired: true,
    inputWidthSize: "6",
    emptyErrorMessage: services.messageService.getEmptyFieldError("name"),
    error: null,
    validation: {
      pattern: "^(([a-zA-Z\\u0600-\\u06FF])+([ a-zA-Z\\u0600-\\u06FF]*)){1,50}$",
      label: "name"
    }
  },

  email: {
    id: "email",
    label: "Email",
    type: "text",
    placeholder: "johndoe@company.com",
    keyboardType: "email",
    isRequired: true,
    inputWidthSize: "6",
    emptyErrorMessage: services.messageService.getEmptyFieldError("email"),
    error: null,
    validation: {
      pattern: "^\\w+([\\+\\.-]?\\w+)*@\\w+([\\.-]?\\w{1,63})*(\\.\\w{2,63})+$",
      label: "email"
    }
  },

  phone: {
    id: "phone",
    label: "Phone Number",
    type: "phone",
    placeholder: "9876543210",
    keyboardType: "tel",
    isRequired: true,
    inputWidthSize: "6",
    emptyErrorMessage: services.messageService.getEmptyFieldError("phone"),
    error: null,
    validation: {
      pattern: "^\\d{9,10}$",
      label: "phone number"
    }
  },

  dob: {
    id: "dob",
    label: "Date of Birth",
    type: "text",
    keyboardType: "date",
    isRequired: true,
    inputWidthSize: "6",
    emptyErrorMessage: services.messageService.getEmptyFieldError("date of birth"),
    error: null,
  },

  gender: {
    id: "gender",
    label: "Gender",
    type: "select",
    placeholder: "Select",
    keyboardType: "text",
    isRequired: true,
    inputWidthSize: "6",
    emptyErrorMessage: services.messageService.getEmptyFieldError("gender"),
    error: null,
  },

  nationality: {
    id: "nationality",
    label: "Nationality",
    type: "select",
    placeholder: "Select",
    keyboardType: "text",
    isRequired: true,
    inputWidthSize: "6",
    isSearchable: true,
    defaultValue: "AE",
    emptyErrorMessage: services.messageService.getEmptyFieldError("nationality"),
    error: null,
  },

  password: {
    id: "password",
    label: "Password",
    type: "password",
    placeholder: "********",
    keyboardType: "text",
    isRequired: true,
    inputWidthSize: "6",
    emptyErrorMessage: services.messageService.getEmptyFieldError("password"),
    error: null,
    validation: {
      pattern: "^(?=.*\\d)(?=.*[a-zA-Z])(?=.*[!@#\\$%\\^&\\*]).{6,40}$",
      label: "password"
    }
  },

  referral: {
    id: "referral",
    label: "Referral Code",
    type: "text",
    placeholder: "AXLTYD",
    keyboardType: "text",
    isRequired: false,
    inputWidthSize: "6"
  },

  store: {
    id: "store",
    label: "Favourite Home Location",
    type: "select",
    placeholder: "Select",
    keyboardType: "text",
    isRequired: true,
    inputWidthSize: "6",
    isSearchable: true,
    emptyErrorMessage: services.messageService.getEmptyFieldError("favourite home location"),
    error: null,
  },

  terms: {
    id: "terms",
    label: "I agree to receive loyalty rewards, offers and updates via email and text.",
    type: "checkbox",
    keyboardType: "text",
    isRequired: true,
    inputWidthSize: "12",
    defaultValue: true,
    emptyErrorMessage: "Please agree to receive rewards and updates to proceed.",
    error: null,
  }
};

// --- Theme Utilities ---

// Convert Hex to RGB object
const hexToRgb = (hex) => {
  let c = hex.replace('#', '');
  if (c.length === 3) c = c.split('').map(char => char + char).join('');
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  return { r, g, b };
};

// Convert RGB to HSL
const rgbToHsl = (r, g, b) => {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
};

// Convert HSL to Hex
const hslToHex = (h, s, l) => {
  s /= 100;
  l /= 100;

  const a = s * Math.min(l, 1 - l);
  const f = (n) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
};

const generateScale = (hex, prefix) => {
  const rgb = hexToRgb(hex);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const isLight = hsl.l > 70;
  const isDark = hsl.l < 30;

  const scale = [100, 200, 300, 400, 500, 600, 700, 800];
  const variables = [];

  scale.forEach(weight => {
    let newL;
    if (weight === 400) {
      newL = hsl.l;
    } else {
      const step = (weight - 400) / 100;
      if (isLight) {
        newL = Math.max(10, hsl.l - (step * 8));
      } else if (isDark) {
        newL = Math.max(5, hsl.l - (step * 5));
      } else {
        newL = Math.max(10, Math.min(96, hsl.l - (step * 10)));
      }
    }
    const currentHex = hslToHex(hsl.h, hsl.s, newL);
    variables.push(`--ui-${prefix}-${weight}: ${currentHex}`);
  });

  return variables;
};

// ConfigBuilder Component
const ConfigBuilder = () => {
  // Basic Config State
  const [dashboardTitle, setDashboardTitle] = useState('My Dashboard');
  const [rootPath, setRootPath] = useState('/app');
  const [defaultCountry, setDefaultCountry] = useState({ label: 'United States', value: 'US' });
  const [usePasswordFlow, setUsePasswordFlow] = useState(true);

  // Theme Builder State
  const [lightColor, setLightColor] = useState('#F8F9FA');
  const [darkColor, setDarkColor] = useState('#212529');
  const [primaryColor, setPrimaryColor] = useState('#3B82F6');
  const [secondaryColor, setSecondaryColor] = useState('#10B981');

  // Schema Builder State
  const [expandedFields, setExpandedFields] = useState({});

  const toggleFieldExpand = (id) => {
    setExpandedFields(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const [fields, setFields] = useState((Object.values(DEFAULT_SCHEMA)).map((field) => {
    let validationType = undefined;
    if (field?.validation?.pattern) {
      if (field.validation.pattern.includes('a-zA-Z')) validationType = 'name';
      if (field.validation.pattern.includes('@')) validationType = 'email';
      if (field.validation.pattern.includes('9,10')) validationType = 'phone';
      if (field.validation.pattern.includes('!@#')) validationType = 'password';
      if (field.validation.pattern === '^\\d{4}$') validationType = 'otp';
    }
    return {
      ...field,
      validation: validationType ? { type: validationType, pattern: field.validation.pattern, label: field.label.replace(/\*$/, '').trim().toLowerCase() } : field.validation
    };
  }));

  // Constants
  const countryOptions = [
    { label: 'United States', value: 'US' },
    { label: 'United Kingdom', value: 'GB' },
    { label: 'United Arab Emirates', value: 'AE' },
    { label: 'India', value: 'IN' },
    { label: 'Canada', value: 'CA' },
    { label: 'Australia', value: 'AU' },
  ];

  const typeOptions = [
    { label: 'Text Input', value: 'text' },
    { label: 'Phone Input', value: 'phone' },
    { label: 'Password Input', value: 'password' },
    { label: 'Select Input', value: 'select' },
    { label: 'Checkbox Input', value: 'checkbox' },
  ];

  const keyboardTypeOptions = [
    { label: 'Text', value: 'text' },
    { label: 'Email', value: 'email' },
    { label: 'Telephone', value: 'tel' },
    { label: 'Date', value: 'date' },
    { label: 'Number', value: 'number' },
  ];

  const widthOptions = [
    { label: 'Half Width (6)', value: '6' },
    { label: 'Full Width (12)', value: '12' },
  ];

  const validationOptions = [
    { label: 'None', value: '' },
    { label: 'Name Pattern', value: 'name' },
    { label: 'Email Pattern', value: 'email' },
    { label: 'Phone Pattern', value: 'phone' },
    { label: 'Password Pattern', value: 'password' },
    { label: 'OTP Pattern', value: 'otp' },
  ];

  // Schema Logic
  const addField = () => {
    const id = `field_${Date.now()}`;
    const newField = {
      id: id,
      label: 'New Field',
      type: 'text',
      keyboardType: 'text',
      isRequired: false,
      inputWidthSize: '12'
    };
    setFields([...fields, newField]);
    setExpandedFields(prev => ({ ...prev, [id]: true }));
  };

  const removeField = (id) => {
    setFields(fields.filter(f => f.id !== id));
  };

  const updateField = (id, key, value) => {
    setFields(fields.map(f => {
      if (f.id === id) {
        if (key === 'validation') {
          if (!value) {
            const { validation, ...rest } = f;
            return rest;
          }
          return { ...f, validation: { type: value } };
        }
        return { ...f, [key]: value };
      }
      return f;
    }));
  };

  // Output Generators
  const PATTERNS = {
    name: "^(([a-zA-Z\\u0600-\\u06FF])+([ a-zA-Z\\u0600-\\u06FF]*)){1,50}$",
    email: "^\\w+([\\+\\.-]?\\w+)*@\\w+([\\.-]?\\w{1,63})*(\\.\\w{2,63})+$",
    phone: "^\\d{9,10}$",
    password: "^(?=.*\\d)(?=.*[a-zA-Z])(?=.*[!@#\\$%\\^&\\*]).{6,40}$",
    otp: "^\\d{4}$"
  };

  const getEmptyErrorMessage = (label, type) => {
    let labelLower = label.toLowerCase();
    if (type === 'checkbox') return "Please agree to receive rewards and updates to proceed.";
    if (type === 'phone' && !labelLower.includes('number')) labelLower = "phone number";
    if (labelLower.includes('nationality')) labelLower = "nationality";
    if (labelLower.includes('store')) labelLower = "favourite home location";
    return services.messageService.getEmptyFieldError(labelLower);
  };

  const generatedSchema = useMemo(() => {
    const formattedSchema = {};

    fields.forEach(f => {
      let safeId = f.id.toLowerCase().replace(/\s+/g, '_');
      if (!safeId) return;

      const baseLabel = f.label.replace(/\*$/, '').trim();

      let fieldOutput = {
        id: safeId,
        label: f.isRequired ? `${baseLabel}*` : baseLabel,
        type: f.type,
        isRequired: f.isRequired,
        inputWidthSize: f.inputWidthSize,
        keyboardType: f.keyboardType || 'text',
        emptyErrorMessage: getEmptyErrorMessage(f.label, f.type)
      };

      if (f.placeholder) fieldOutput.placeholder = f.placeholder;
      if (f.isSearchable !== undefined) fieldOutput.isSearchable = f.isSearchable;
      if (f.defaultValue !== undefined) fieldOutput.defaultValue = f.defaultValue;

      if (f.validation?.type && PATTERNS[f.validation.type]) {
        fieldOutput.validation = {
          pattern: PATTERNS[f.validation.type],
          label: baseLabel.toLowerCase()
        };
      } else if (f.validation?.pattern) {
        fieldOutput.validation = {
          pattern: f.validation.pattern,
          label: baseLabel.toLowerCase()
        };
      }

      formattedSchema[safeId] = fieldOutput;
    });

    return formattedSchema;
  }, [fields]);

  const generatedConfig = useMemo(() => {
    const config = {
      rootPath,
      dashboardTitle,
      defaultCountry: defaultCountry.value,
      usePasswordFlow,
      signupSchema: generatedSchema
    };
    return JSON.stringify(config, null, 2);
  }, [dashboardTitle, rootPath, defaultCountry, usePasswordFlow, generatedSchema]);

  const generatedTheme = useMemo(() => {
    try {
      const primaryVars = generateScale(primaryColor, 'primary');
      const secondaryVars = generateScale(secondaryColor, 'secondary');

      const lightRgb = hexToRgb(lightColor);
      const darkRgb = hexToRgb(darkColor);
      const primaryRgb = hexToRgb(primaryColor);
      const secondaryRgb = hexToRgb(secondaryColor);

      const p600hex = primaryVars.find(v => v.includes('--ui-primary-600'))?.match(/#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})/)?.[0] || '#000000';
      const primary600Rgb = hexToRgb(p600hex);

      const greyScale = [
        `  --ui-grey-0: #FFFFFF;`,
        `  --ui-grey-100: ${lightColor};`,
        `  --ui-grey-200: #F1F3F5;`,
        `  --ui-grey-300: #E9ECEF;`,
        `  --ui-grey-400: #DEE2E6;`,
        `  --ui-grey-500: #CED4DA;`,
        `  --ui-grey-600: #ADB5BD;`,
        `  --ui-grey-700: #868E96;`,
        `  --ui-grey-800: #495057;`,
        `  --ui-grey-900: #343A40;`,
        `  --ui-grey-1000: ${darkColor};`
      ];

      const variables = [
        `:root {`,
        `  /* greys unchanged */`,
        ...greyScale,
        ``,
        `  /* PRIMARY */`,
        ...primaryVars.map(v => `  ${v};`),
        ``,
        `  /* SECONDARY */`,
        ...secondaryVars.map(v => `  ${v};`),
        ``,
        `  /* semantic tokens */`,
        `  --ui-color-primary: var(--ui-primary-400);`,
        `  --ui-color-secondary: var(--ui-secondary-400);`,
        `  --ui-color-white: var(--ui-grey-0);`,
        `  --ui-color-light: var(--ui-grey-100);`,
        `  --ui-color-grey: var(--ui-grey-400);`,
        `  --ui-color-dark: var(--ui-grey-1000);`,
        `  --ui-color-muted: var(--ui-grey-700);`,
        ``,
        `  /* rgb */`,
        `  --ui-primary-400-rgb: ${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b};`,
        `  --ui-primary-600-rgb: ${primary600Rgb.r}, ${primary600Rgb.g}, ${primary600Rgb.b};`,
        `  --ui-grey-0-rgb: 255, 255, 255;`,
        `  --ui-grey-100-rgb: ${lightRgb.r}, ${lightRgb.g}, ${lightRgb.b};`,
        `  --ui-grey-1000-rgb: ${darkRgb.r}, ${darkRgb.g}, ${darkRgb.b};`,
        `  --ui-secondary-400-rgb: ${secondaryRgb.r}, ${secondaryRgb.g}, ${secondaryRgb.b};`,
        `}`
      ];

      return variables.join('\n');
    } catch (e) {
      return '/* Invalid Color Values */';
    }
  }, [lightColor, darkColor, primaryColor, secondaryColor]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).catch(() => { });
  };

  return (
    <div className="qb-builder-wrapper d-flex flex-column gap-4 p-4 qb-bg-grey-0 min-vh-100 container">
      <div className="d-flex flex-column gap-1">
        <h1 className="qb-fs-title-lg qb-fw-bold qb-text-grey-1000 m-0">Builder configuration</h1>
        <p className="qb-fs-paragraph-md qb-text-grey-700 m-0">Generate your SPA config, form schema, and themes safely.</p>
      </div>

      <div className="row gy-3 gx-3">
        {/* Editor Column */}
        <div className="col-12 col-lg-6 d-flex flex-column gap-4 p-0 pe-md-2">

          {/* Basic Config */}
          <div className="qb-builder-panel qb-br-12 p-4 d-flex flex-column gap-3">
            <h2 className="qb-fs-title-md qb-fw-semi-bold m-0 qb-text-grey-1000">1. Basic Config</h2>
            <div className="d-flex flex-column gap-3">
              <TextInput
                label="Dashboard Title"
                value={dashboardTitle}
                onChange={(val) => setDashboardTitle(val)}
              />
              <TextInput
                label="Root Path"
                value={rootPath}
                onChange={(val) => setRootPath(val)}
              />
              <SelectInput
                label="Default Country"
                selected={defaultCountry}
                options={countryOptions}
                onSelect={(val) => setDefaultCountry(val)}
                isInputAllowed={false}
                isSearchable={false}
              />
              <CheckboxInput
                label="Use Password Flow"
                checked={usePasswordFlow}
                onChange={(val) => setUsePasswordFlow(val)}
              />
            </div>
          </div>

          {/* Theme Builder */}
          <div className="qb-builder-panel qb-br-12 p-4 d-flex flex-column gap-3">
            <h2 className="qb-fs-title-md qb-fw-semi-bold m-0 qb-text-grey-1000">2. Theme Builder</h2>
            <div className="row m-0">
              <div className="col-6 p-0 pe-2 pb-3">
                <TextInput
                  label="Light Color"
                  type="color"
                  value={lightColor}
                  onChange={(val) => setLightColor(val)}
                />
              </div>
              <div className="col-6 p-0 ps-2 pb-3">
                <TextInput
                  label="Dark Color"
                  type="color"
                  value={darkColor}
                  onChange={(val) => setDarkColor(val)}
                />
              </div>
              <div className="col-6 p-0 pe-2">
                <TextInput
                  label="Primary Color"
                  type="color"
                  value={primaryColor}
                  onChange={(val) => setPrimaryColor(val)}
                />
              </div>
              <div className="col-6 p-0 ps-2">
                <TextInput
                  label="Secondary Color"
                  type="color"
                  value={secondaryColor}
                  onChange={(val) => setSecondaryColor(val)}
                />
              </div>
            </div>
          </div>

          {/* Schema Builder */}
          <div className="qb-builder-panel qb-br-12 p-4 d-flex flex-column gap-3">
            <div className="d-flex justify-content-between align-items-center">
              <h2 className="qb-fs-title-md qb-fw-semi-bold m-0 qb-text-grey-1000">3. Schema Builder</h2>
              <button className="btn qb-btn-primary qb-fs-paragraph-sm qb-br-8 px-3 py-2" onClick={addField}>+ Add Field</button>
            </div>

            <div className="d-flex flex-column gap-3">
              <DraggableList
                items={fields}
                keyField="id"
                onSort={(newFields) => setFields(newFields)}
                renderItem={(field, index, dragHandlers) => {
                  const isExpanded = expandedFields[field.id];
                  return (
                    <Draggable
                      className="qb-schema-field-card qb-br-8 p-3 d-flex flex-column gap-3"
                      onDragStart={dragHandlers.onDragStart}
                      onDragEnter={dragHandlers.onDragEnter}
                      onDragEnd={dragHandlers.onDragEnd}
                    >
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center gap-2">
                          <div style={{ cursor: 'grab' }} onMouseDown={dragHandlers.onDragStart}><DragIcon /></div>
                          <span className="qb-fs-paragraph-sm qb-fw-bold qb-text-grey-700 qb-cursor-pointer d-flex align-items-center gap-2" onClick={() => toggleFieldExpand(field.id)}>
                            {field.label || `Field ${index + 1}`}
                            <span style={{ fontSize: '10px' }}>{isExpanded ? '▼' : '▶'}</span>
                          </span>
                        </div>
                        <button type="button" className="btn qb-btn-danger qb-fs-paragraph-xs p-1" onClick={() => removeField(field.id)}>Remove</button>
                      </div>
                      {isExpanded && (
                        <div className="row m-0 gap-y-3 pt-2" style={{ borderTop: '1px solid var(--ui-grey-100)' }}>
                          <div className="col-6 p-0 pe-2 pb-3">
                            <TextInput
                              label="ID"
                              value={field.id}
                              onChange={(val) => updateField(field.id, 'id', val)}
                            />
                          </div>
                          <div className="col-6 p-0 ps-2 pb-3">
                            <TextInput
                              label="Label"
                              value={field.label}
                              onChange={(val) => updateField(field.id, 'label', val)}
                            />
                          </div>
                          <div className="col-6 p-0 pe-2 pb-3">
                            <SelectInput
                              label="Type"
                              selected={typeOptions.find(o => o.value === field.type) || typeOptions[0]}
                              options={typeOptions}
                              onSelect={(val) => updateField(field.id, 'type', val.value)}
                              isInputAllowed={false}
                              isSearchable={false}
                            />
                          </div>
                          <div className="col-6 p-0 ps-2 pb-3">
                            <SelectInput
                              label="Keyboard Type"
                              selected={keyboardTypeOptions.find(o => o.value === field.keyboardType) || keyboardTypeOptions[0]}
                              options={keyboardTypeOptions}
                              onSelect={(val) => updateField(field.id, 'keyboardType', val.value)}
                              isInputAllowed={false}
                              isSearchable={false}
                            />
                          </div>
                          <div className="col-6 p-0 pe-2 pb-3">
                            <SelectInput
                              label="Width"
                              selected={widthOptions.find(o => o.value === field.inputWidthSize) || widthOptions[1]}
                              options={widthOptions}
                              onSelect={(val) => updateField(field.id, 'inputWidthSize', val.value)}
                              isInputAllowed={false}
                              isSearchable={false}
                            />
                          </div>
                          <div className="col-6 p-0 ps-2 pb-3">
                            <SelectInput
                              label="Validation Pattern"
                              selected={validationOptions.find(o => o.value === field.validation?.type) || validationOptions[0]}
                              options={validationOptions}
                              onSelect={(val) => updateField(field.id, 'validation', val.value)}
                              isInputAllowed={false}
                              isSearchable={false}
                            />
                          </div>
                          <div className="col-12 p-0 pb-3">
                            <TextInput
                              label="Placeholder (Optional)"
                              value={field.placeholder || ''}
                              onChange={(val) => updateField(field.id, 'placeholder', val)}
                            />
                          </div>
                          <div className="col-12 p-0 d-flex align-items-end">
                            <CheckboxInput
                              label="Required"
                              checked={field.isRequired}
                              onChange={(val) => updateField(field.id, 'isRequired', val)}
                            />
                          </div>
                        </div>
                      )}
                    </Draggable>
                  );
                }}
              />
              {fields.length === 0 && (
                <div className="text-center p-4 qb-text-grey-500 qb-fs-paragraph-sm">No fields added yet.</div>
              )}
            </div>
          </div>
        </div>

        {/* Output Column */}
        <div className="col-12 col-lg-6 d-flex flex-column gap-4 p-0 ps-md-2">
          <div className="qb-builder-panel qb-br-12 p-4 d-flex flex-column gap-3 h-100">
            <h2 className="qb-fs-title-md qb-fw-semi-bold m-0 qb-text-grey-1000">4. Output Panel</h2>

            <div className="d-flex flex-column gap-2 flex-fill">
              <div className="d-flex justify-content-between align-items-center">
                <span className="qb-fs-paragraph-sm qb-fw-bold qb-text-grey-800">config.json</span>
                <button className="btn btn-sm qb-btn-secondary qb-fs-paragraph-xs py-1 px-2 qb-br-4" onClick={() => copyToClipboard(generatedConfig)}>Copy</button>
              </div>
              <textarea
                className="qb-builder-output-textarea qb-br-8 p-3 w-100 flex-fill"
                readOnly
                value={generatedConfig}
              />
            </div>

            <div className="d-flex flex-column gap-2 flex-fill pt-3">
              <div className="d-flex justify-content-between align-items-center">
                <span className="qb-fs-paragraph-sm qb-fw-bold qb-text-grey-800">theme.css</span>
                <button className="btn btn-sm qb-btn-secondary qb-fs-paragraph-xs py-1 px-2 qb-br-4" onClick={() => copyToClipboard(generatedTheme)}>Copy</button>
              </div>
              <textarea
                className="qb-builder-output-textarea qb-br-8 p-3 w-100 flex-fill"
                readOnly
                value={generatedTheme}
              />
            </div>
          </div>

          <SchemaPreview schema={generatedSchema} />
        </div>
      </div>
    </div>
  );
};

const SchemaPreview = ({ schema }) => {
  const mockOptions = {
    gender: [{ label: 'Male', value: 'M' }, { label: 'Female', value: 'F' }, { label: 'Other', value: 'O' }],
    nationality: [{ label: 'United States', value: 'US' }, { label: 'United Arab Emirates', value: 'AE' }],
    store: [{ label: 'Store A', value: 'A' }, { label: 'Store B', value: 'B' }]
  };

  const dynamicOptions = {};
  const defaultDropdowns = {};
  Object.values(schema).forEach(f => {
    if (f.type === 'select') {
      dynamicOptions[f.id] = mockOptions[f.id] || [{ label: 'Option 1', value: '1' }, { label: 'Option 2', value: '2' }];
      if (f.defaultValue) {
        defaultDropdowns[f.id] = f.defaultValue;
      }
    }
  });

  const form = useFormEngine(schema);
  const ui = useFormUi(dynamicOptions, defaultDropdowns);

  const handleInputChange = (val, id) => {
    if (id) form.setField(id, val);
  }

  const handleSelect = (val, id) => {
    if (id) {
      ui.updateDropdown(id, val);
      if (id !== "phone") form.setField(id, val.label);
    }
  }

  const handleSelectChange = (val, id) => {
    if (id && schema[id]?.isSearchable) {
      ui.updateDropdown(id, null);
      const allOpts = dynamicOptions[id] || [];
      ui.updateOptions(id, allOpts.filter(o => o.label.toLowerCase().includes(val.toLowerCase())));
    }
  }

  return (
    <div className="qb-builder-panel qb-br-12 p-4 d-flex flex-column gap-3 h-100">
      <h2 className="qb-fs-title-md qb-fw-semi-bold m-0 qb-text-grey-1000">5. Schema Preview</h2>
      <div className="row gy-3 m-0">
        {Object.keys(schema).map(id => {
          if (!form.visibility[id]) return null;
          const f = schema[id];
          return (
            <div className={`col-12 col-lg-${f.inputWidthSize}`} key={`preview-${id}`}>
              {f.type === "password" ? (
                <PasswordInput
                  id={id}
                  value={form.values[id] || ''}
                  disabled={form.disabled[id]}
                  error={form.errors[id]}
                  placeholder={f.placeholder}
                  label={f.label}
                  required={f.isRequired}
                  onChange={handleInputChange}
                />
              ) : f.type === "phone" ? (
                <PhoneInput
                  id={id}
                  value={form.values[id] || ''}
                  disabled={form.disabled[id]}
                  error={form.errors[id]}
                  placeholder={f.placeholder}
                  label={f.label}
                  countryOptions={ui.options[id] || []}
                  selectedCountry={ui.dropdowns[id]}
                  required={f.isRequired}
                  onCountrySelect={handleSelect}
                  onChange={handleInputChange}
                />
              ) : f.type === "select" ? (
                <SelectInput
                  id={id}
                  selected={ui.dropdowns[id]}
                  disabled={form.disabled[id]}
                  error={form.errors[id]}
                  placeholder={f.placeholder}
                  type={f.keyboardType}
                  label={f.label}
                  options={ui.options[id] || []}
                  isInputAllowed={f.isSearchable}
                  isSearchable={f.isSearchable || false}
                  required={f.isRequired}
                  onSelect={handleSelect}
                  onChange={handleSelectChange}
                />
              ) : f.type === "checkbox" ? (
                <CheckboxInput
                  id={id}
                  checked={form.values[id] || false}
                  error={form.errors[id]}
                  label={f.label}
                  required={f.isRequired}
                  onChange={handleInputChange}
                />
              ) : (
                <TextInput
                  id={id}
                  value={form.values[id] || ''}
                  disabled={form.disabled[id]}
                  error={form.errors[id]}
                  placeholder={f.placeholder}
                  type={f.keyboardType}
                  label={f.label}
                  required={f.isRequired}
                  onChange={handleInputChange}
                />
              )}
            </div>
          )
        })}
      </div>
      <div className="col-12 pt-3">
        <PrimaryButton isActive={form.isComplete} onDisabledClick={form.validateRequiredFields} onClick={() => form.handleValidation(ui.dropdowns)}>
          Test Validation
        </PrimaryButton>
      </div>
    </div>
  )
}

export default ConfigBuilder;
