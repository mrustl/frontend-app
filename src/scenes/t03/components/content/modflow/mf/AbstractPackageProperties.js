import PropTypes from 'prop-types';
import React from 'react';

import {Icon, Popup} from 'semantic-ui-react';
import {FlopyModflowPackage} from '../../../../../../core/model/flopy/packages/mf';

class AbstractPackageProperties extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mfPackage: props.mfPackage.toObject(),
            activeIndex: 0
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            mfPackage: nextProps.mfPackage.toObject()
        });
    }

    handleClickAccordion = (e, titleProps) => {
        const {index} = titleProps;
        const {activeIndex} = this.state;
        const newIndex = activeIndex === index ? -1 : index;

        this.setState({
            activeIndex: newIndex
        });
    };

    handleOnChange = (e) => {
        const {name, value} = e.target;

        return this.setState({
            mfPackage: {
                ...this.state.mfPackage,
                [name]: value
            }
        });
    };

    handleOnSelect = (e, {name, value}) => {
        const mfPackage = this.props.mfPackage;
        mfPackage[name] = value;
        this.props.onChange(mfPackage);
    };

    handleOnBlur = (e) => {
        const {name, value} = e.target;
        this.setState({mfPackage: {...this.state.mfPackage, [name]: value}});
        const mfPackage = this.props.mfPackage;
        mfPackage[name] = value;
        this.props.onChange(mfPackage);
    };

    renderInfoPopup = (description, title, position = 'top left', iconOutside = false) => {
        return (
            <Popup className='popupFix'
                   trigger={
                       <Icon className={iconOutside ? 'iconOutside' : 'iconFix'}
                             name='info'
                             circular link
                       />
                   }
                   data-html="true"
                   position={position}
            >
                <Popup.Header>
                    {title}
                </Popup.Header>
                <Popup.Content className='contentFix'>
                    {description}
                </Popup.Content>
            </Popup>
        );
    };
}

AbstractPackageProperties.propTypes = {
    mfPackage: PropTypes.instanceOf(FlopyModflowPackage),
    onChange: PropTypes.func.isRequired,
    readonly: PropTypes.bool.isRequired,
};

export default AbstractPackageProperties;