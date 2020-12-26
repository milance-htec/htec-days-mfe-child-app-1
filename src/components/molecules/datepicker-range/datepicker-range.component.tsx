import React, { FunctionComponent, useEffect, useState } from 'react';
import classnames from 'classnames';

/* Types */
import { DatepickerRangeProps } from './datepicker-range.types';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';

/* Material-Ui & Moment */
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import DateRangeIcon from '@material-ui/icons/DateRange';
import moment, { Moment } from 'moment';
import MomentUtils from '@date-io/moment';

/* Styles */
import './datepicker-range.scss';

export const DATERANGE_PICKER_TEST_ID = 'daterange-picker';
export const DATERANGE_PICKER_DAY_TEST_ID = 'daterange-picker-day';
export const DATERANGE_PICKER_CLEAR_TEST_ID = 'daterange-picker-clear';

export const DateRangePicker: FunctionComponent<DatepickerRangeProps> = ({
  startDate,
  endDate,
  onChange,
  labelFunc,
  onClose = () => {},
  onClick,
  onClear = () => {},
  setIsOpen,
  isOpen,
  format = 'YYYY-MM-DD',
  emptyLabel = '',
  autoOk = true,
  className,
  style,
}) => {
  const locale = moment.locale('en');
  const [begin, setBegin] = useState<Moment | null>(startDate ? moment(startDate) : null);
  const [end, setEnd] = useState<Moment | null>(endDate ? moment(endDate) : null);
  const [hover, setHover] = useState<Moment | null>(null);
  const [isPickerHovered, setIsPickerHovered] = useState(false);

  let maxDate: Moment;

  if (begin && (end || hover)) {
    if (end) {
      maxDate = moment.max(begin, end);
    } else if (hover) {
      maxDate = moment.max(begin, hover);
    }
  } else {
    maxDate = moment().add(100, 'years');
  }

  const sortDates = (firstDate: Moment, secondDate: Moment) => {
    return firstDate.isAfter(secondDate) ? [secondDate, firstDate] : [firstDate, secondDate];
  };

  const handleDateClick = (day: MaterialUiPickersDate) => {
    const momentFormatDay = moment(day?.toDate());
    if (!begin) {
      setBegin(momentFormatDay);
    } else if (!end) {
      if (begin.isAfter(day)) {
        setBegin(momentFormatDay);
      } else {
        setEnd(momentFormatDay);
        onChange(sortDates(begin, momentFormatDay));
        if (autoOk) {
          onClose();
          setIsOpen(false);
        }
      }
    } else {
      setBegin(momentFormatDay);
      setEnd(null);
    }
  };

  const renderDay = (
    day: MaterialUiPickersDate,
    selectedDate: MaterialUiPickersDate,
    dayInCurrentMonth: boolean,
    dayComponent: JSX.Element,
  ) => {
    return (
      <div
        data-testid={`${DATERANGE_PICKER_DAY_TEST_ID}-${moment(day).date()}`}
        className={classnames('date-picker__day', {
          'date-picker__day--hidden': dayComponent.props.hidden,
          'date-picker__day--current':
            moment(day?.toDate()).date() === moment(Date.now()).date() &&
            moment(day?.toDate()).month() === moment(Date.now()).month() &&
            moment(day?.toDate()).year() === moment(Date.now()).year(),
          'date-picker__day--selected':
            begin &&
            moment(day?.toDate()).isAfter(begin) &&
            (end ? moment(day?.toDate()).isSameOrBefore(end) : moment(day?.toDate()).isSameOrBefore(hover)),
          'date-picker__day--begin-cap': moment(day?.toDate()).isSame(begin, 'day'),
          'date-picker__day--end-cap': moment(day?.toDate()).isSame(maxDate, 'day'),
        })}
        onClick={() => {
          handleDateClick(day);
        }}
        onMouseEnter={() => setHover(moment(day?.toDate()))}
      >
        <IconButton className="date-picker__button" disabled={dayComponent.props.hidden || dayComponent.props.disabled}>
          <span className="date-picker__button--span">{`${moment(day).date()}`}</span>
        </IconButton>
      </div>
    );
  };

  const formatDate = (dateBegin: Moment, dateEnd: Moment) => {
    return dateBegin.isAfter(dateEnd)
      ? `${dateEnd.format(format)} - ${dateBegin.format(format)}`
      : `${dateBegin.format(format)} - ${dateEnd.format(format)}`;
  };

  const clearDates = (e: React.MouseEvent) => {
    e.stopPropagation();
    setBegin(null);
    setEnd(null);
    onChange([]);
    setIsOpen(false);
    onClear();
  };

  useEffect(() => {
    if (startDate && endDate) {
      setBegin(startDate);
      setEnd(endDate);
    } else {
      setBegin(null);
      setEnd(null);
    }
    // eslint-disable-next-line
  }, [startDate, endDate]);

  return (
    <MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils} locale={locale}>
      <KeyboardDatePicker
        data-testid={DATERANGE_PICKER_TEST_ID}
        onMouseEnter={() => setIsPickerHovered(true)}
        onMouseLeave={() => setIsPickerHovered(false)}
        onClick={() => setIsOpen(true)}
        value={begin ?? Date.now()}
        className={classnames('datepicker-range', className)}
        style={style}
        open={isOpen}
        disableToolbar
        renderDay={renderDay}
        onClose={() => {
          if (begin && end) {
            onChange(sortDates(begin, end));
            onClose();
          }
          setIsOpen(false);
        }}
        onChange={() => {}}
        labelFunc={(date, invalid) =>
          labelFunc
            ? labelFunc([begin, end].sort(), invalid)
            : date && begin && end
            ? formatDate(begin, end)
            : emptyLabel || ''
        }
        keyboardIcon={
          <div className="datepicker-icons">
            <DateRangeIcon className="datepicker-icons__date-range" />
            {begin && end ? (
              <CloseIcon
                data-testid={DATERANGE_PICKER_CLEAR_TEST_ID}
                className={classnames('datepicker-icons__clear', {
                  'datepicker-icons__clear--visible': isPickerHovered,
                })}
                onClick={clearDates}
              />
            ) : null}
          </div>
        }
        KeyboardButtonProps={{ disableRipple: true, disabled: false }}
        variant="inline"
      />
    </MuiPickersUtilsProvider>
  );
};
