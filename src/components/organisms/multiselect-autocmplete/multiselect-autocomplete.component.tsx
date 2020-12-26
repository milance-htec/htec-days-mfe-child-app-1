import React, { FunctionComponent } from 'react';
import classnames from 'classnames';

/* Components */
import { Text } from 'components/atoms';
import { LabeledCheckbox } from 'components/molecules';

/* Types */
import { MultiselectAutocompleteProps, OptionState } from './multiselect-autcomplete.types';

/* Material-Ui*/
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import Chip from '@material-ui/core/Chip';
import { InputAdornment } from '@material-ui/core';

/* Style */
import './multiselect-autocomplete.scss';

export const MULTISELECT_AUTOCOMPLETE_TEST_ID = 'multiselect-autocomplete';

export const MultiselectAutocomplete: FunctionComponent<MultiselectAutocompleteProps> = ({
  className,
  defaultValues,
  disableCloseOnSelect = false,
  getLimitTagsText,
  helperText = '',
  inputFieldQaName = '',
  label = '',
  limitTags = 2,
  onChange,
  onClose,
  optionLabel = 'title',
  optionQaName,
  options,
  placeholder = 'Items',
  popupIconQaName = '',
  renderInput,
  renderOption,
  renderTags,
  selectedCount,
  size = 'medium',
  style,
  value,
}) => {
  return (
    <div data-testid={MULTISELECT_AUTOCOMPLETE_TEST_ID} className={classnames('multiselect', className)} style={style}>
      <Autocomplete
        defaultValue={defaultValues}
        disableCloseOnSelect={disableCloseOnSelect}
        getOptionLabel={(option: any) => option[optionLabel]}
        limitTags={limitTags}
        multiple
        options={options}
        size={size}
        value={value}
        onClose={onClose}
        onChange={onChange}
        getLimitTagsText={
          getLimitTagsText
            ? getLimitTagsText
            : (more: number) => <Text>{`+ ${selectedCount - limitTags} ${placeholder}`}</Text>
        }
        renderOption={
          renderOption
            ? renderOption
            : (option: any, state: OptionState) => (
                <LabeledCheckbox
                  checked={state.selected}
                  qaName={optionQaName}
                  text={option[optionLabel]}
                  value={option[optionLabel]}
                />
              )
        }
        renderInput={
          renderInput
            ? renderInput
            : (params: any) => {
                return (
                  <TextField
                    {...params}
                    label={label}
                    helperText={helperText}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <InputAdornment
                          {...params.InputProps.endAdornment.props}
                          data-qa-name={popupIconQaName}
                          classes={{ root: 'autocomplete__input-end-adornment' }}
                        />
                      ),
                    }}
                    inputProps={{
                      ...params.inputProps,
                      'data-qa-name': inputFieldQaName,
                    }}
                  />
                );
              }
        }
        renderTags={
          renderTags
            ? renderTags
            : (values: any[], getTagProps: (params: any) => any) => {
                const renderValues = values.length > limitTags ? values.slice(0, limitTags) : values;
                const renderElements = renderValues.map((option: any, index: number) => (
                  <Chip key={index} variant="outlined" label={option[optionLabel]} {...getTagProps({ index })} />
                ));
                if (values.length > limitTags) {
                  renderElements.push(
                    <Text key={values.length + 1}>{`+ ${values.length - limitTags} ${placeholder}`}</Text>,
                  );
                }
                return renderElements;
              }
        }
      />
    </div>
  );
};
