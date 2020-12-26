import { configure } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import '@testing-library/jest-dom/extend-expect';
// import '@testing-library/react/cleanup-after-each';

configure({ adapter: new EnzymeAdapter() });
