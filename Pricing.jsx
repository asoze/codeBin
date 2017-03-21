/**
 *  This "Pricing" Component includes the front end logic and display for the primary and
 *      secondary prices and the MSRP and Reduced labels that can be added to them
 *
 *  TODO: Currently beings used by Listing.ListView component but will likely need to
 *      be extended to allow use other places (ex Listing.GridView)
 **/

import React from 'react';
import classnames from 'classnames';

export default function Pricing(props) {
    const isMSRP = props.source && props.source.toLowerCase() === 'msrp';
    const isLarge = props.uiType === 'large';
    const isMedium = props.uiType === 'medium';
    const isDefault = !(isLarge || isMedium);

    const primaryClasses = classnames({
        'margin-collapse-bottom': true,
        'margin-collapse-top': true,
    });

    const componentClasses = classnames({
        'list-unstyled': true,
        'margin-collapse-bottom': isLarge,
    });

    const firstPriceClasses = classnames(
        isLarge ? 'text-lg' : isMedium && 'text-md',
    );

    const secondPriceClasses = classnames({
        'text-sm': isDefault,
    });

    const afterFirstLabelClasses = classnames({
        'text-success': true,
        'text-sm': isDefault,
    });

    const noPriceAvailableClasses = classnames({
        'text-md': !isDefault,
    });

    let primaryPrice = (
        <li>
            <strong>
                <span data-qaid="cntnr-prcng-noprice"
                      className={noPriceAvailableClasses}>
                    No Price Available
                </span>
            </strong>
        </li>
    );
    let secondaryPrice = null;
    let beforeFirstLabel = null;
    let afterFirstLabel = null;
    let secondLabel = null;

    // Logically define the fields first
    if (props.firstPrice) {
        // MSRP Label to the left of Primary Price
        if (isMSRP && !props.secondPrice && !props.incentivePrice) {
            beforeFirstLabel = 'MSRP ';
        }

        // "Reduced!" Label to the right of Primary Price
        if (props.reducedPrice) {
            afterFirstLabel = props.reducedPriceText;
        }
    }
    if (props.secondPrice && isMSRP) {
        // MSRP Label to the left of Secondary Price
        secondLabel = 'MSRP';
    }

    if (props.firstPrice || props.secondPrice) {

        if (afterFirstLabel) {
            afterFirstLabel = (
                <div
                    className={afterFirstLabelClasses}
                    data-qaid="cntnr-prcng-rdcd">
                    {afterFirstLabel}
                </div>
            );
        }

        primaryPrice = (
            <li>
                <div
                    title="Car Price"
                    className={primaryClasses}
                    data-qaid={props['data-qaid'] + '-outer'}>
                    {beforeFirstLabel}
                    <strong
                        className={firstPriceClasses}
                        data-qaid="cntnr-lstng-price1">
                        {props.firstPrice}
                    </strong>
                </div>
                {afterFirstLabel}
            </li>
        );

        if (props.secondPrice) {
            secondaryPrice = (
                <li className={secondPriceClasses}>
                    <span data-qaid="cntnr-prcng-msrp">{secondLabel} </span>
                    <span data-qaid="cntnr-lstng-price2">{props.secondPrice}</span>
                </li>
            );
        }
    }

    return (
        <ul
            className={componentClasses}
            data-qaid={props['data-qaid']}
        >
            {primaryPrice}
            {secondaryPrice}
        </ul>
    );
}

Pricing.propTypes = {
    derivedPrice: React.PropTypes.string,
    incentivePrice: React.PropTypes.string,
    firstPrice: React.PropTypes.string,
    reducedPrice: React.PropTypes.bool,
    reducedPriceText: React.PropTypes.string,
    secondPrice: React.PropTypes.string,
    source: React.PropTypes.string,
    uiType: React.PropTypes.string,
// placeholders for likely adding title and expirationDate later but not yet implemented
//    title: React.PropTypes.string,
//    expirationDate: React.PropTypes.string,
    'data-qaid': React.PropTypes.string,
    'className': React.PropTypes.string,
};

Pricing.defaultProps = {
    'data-qaid': 'cntnr-lstng-price',
    uiType: 'srp',
    reducedPriceText: 'Reduced!',   // default to hardcoded string since SRP doesn't pass in
};

