
import React from 'react';
import Table from 'reaxl/lib/Table';

import ListingsStore from 'stores/ListingsStore';

import StarRating from 'reaxl/lib/StarRating';
import VehicleTitle from 'pieces/vehicledetails/VehicleTitle';

// utilities
import classnames from 'classnames';

class ModelDetails extends React.Component {

    componentDidMount() {
        this.props.getTabContent();
    }

    replaceAll( name, search, replace ) {
        const target = name;
        return target.replace(new RegExp(search, 'g'), replace);
    }

    buildFeatureRow( item1, item2, item3 ) {
        // let keyIdx = 9;
        let keyIdx = item1.code;
        if ( item2 ) {
            keyIdx += item2.code;
        }
        if ( item3 ) {
            keyIdx += item3.code;
        }
        const row = (
            <tr key={keyIdx}>
                { this.buildNameCell(item1) }
                { this.buildTypeCell(item1) }
                { this.buildNameCell(item2) }
                { this.buildTypeCell(item2) }
                { this.buildNameCell(item3) }
                { this.buildTypeCell(item3) }
            </tr>
        );
        return row;
    }


    // SPECIFICATIONS
    buildSpecTable( title, internals ) {
        if ( !title ) {
            title = '';
        }

        let specTable = '';

        if ( internals && !this.props.useTwoColumn ) {
            const qaTitle = this.replaceAll(title, ' ', '');
            const qaid = 'cntnr-' + qaTitle + 'Header';
            specTable = (
                <div>
                    <h2 className=" text-bold padding-horizontal-sm"
                        data-qaid={ qaid }>{ title }</h2>
                    <Table
                        condensed
                        className="">
                        { internals }
                    </Table>
                </div>
            );
        } else if ( internals && this.props.useTwoColumn ) {
            specTable = (
                <div>
                    <h2 className="text-bold padding-horizontal-sm">{ title }</h2>
                    <Table
                        condensed
                        className="">
                        { internals }
                    </Table>
                </div>
            );
        }

        return specTable;
    }

    buildSpecRow( name, value, suffix, prefix ) {
        let html = null;
        if ( !suffix ) {
            suffix = '';
        }
        if ( !prefix ) {
            prefix = '';
        }
        let fullValue = (
            <td className="text-right">
                <span className="text-gray">Information Unavailable</span>
            </td>
        );
        if ( value ) {
            fullValue = (
                <td className={classnames('text-right', {'text-bold': this.props.isLabeValueBold})}>
                    { prefix + ' ' + value + ' ' + suffix }
                </td>
            );
        }

        if ( name ) {
            const qaid = 'cntnr-' + this.replaceAll(name, ' ', '' ).split('(')[0];
            if ( this.props.useTwoColumn ) {
                html = (
                    <tr className="margin-vertical-sm"
                        data-qaid={ qaid }>
                        <td>{ name }</td>
                        { fullValue }
                    </tr>
                );
            } else {
                html = (
                    <tr data-qaid={ qaid }>
                        <td className={this.props.labelColor}>{ name }</td>
                        { fullValue }
                    </tr>
                );
            }
        }
        return html;
    }

    buildFeatureRowWithIdx( name, value, idx ) {
        let html = null;
        let index = idx + '' + (Math.random() * 100);
        if ( name && value ) {
            html = (
                <tr className="margin-vertical-sm"
                    key={ index }>
                    <td className={this.props.labelColor}>{ name }</td>
                    <td className={classnames('text-right', {'text-bold': this.props.isLabeValueBold})}>{ value }</td>
                </tr>
            );
        }

        return html;
    }

    buildFeatureTable( title, standards, optionals ) {
        if ( !Array.isArray( standards ) ) {
            standards = [];
        }

        if ( !Array.isArray( optionals ) ) {
            optionals = [];
        }

        if ( standards.length === 0 && optionals.length === 0 ) {
            return null;
        }

        const stdItems = standards.map((item, idx) => {
            return this.buildFeatureRowWithIdx( item.name, 'std', idx );
        });

        const optItems = optionals.map((item, idx) => {
            return this.buildFeatureRowWithIdx( item.name, 'opt', idx );
        });

        const features = stdItems.concat( optItems );
        const half = Math.ceil( features.length / 2);
        const left = features.splice(0, half);
        const right = features;
        const rowQaid = 'cntnr-' + this.replaceAll(title, ' ', '');
        const titleQaid = 'cntnr-' + this.replaceAll(title, ' ', '') + 'Header';

        let tableAttrs = 'table-condensed';

        return (
            <div>
                <h2 className="text-md text-bold margin-vertical-sm"
                    data-qaid={ titleQaid }>
                    { title }
                </h2>
                <div className="row"
                     data-qaid={ rowQaid }>
                    <div className="col-md-6">
                        <Table className={ tableAttrs }>
                            <tbody>
                            { left }
                            </tbody>
                        </Table>
                    </div>

                    <div className="col-md-6">
                        <Table className={ tableAttrs }>
                            <tbody>
                            { right }
                            </tbody>
                        </Table>
                    </div>
                </div>
            </div>
        );
    }

    buildEngineDetails() {
        if ( !this.props.overall.features ) {
            return null;
        }

        const engineBase = this.props.overall.features.standardEngine;

        if ( !engineBase ) {
            return null;
        }

        if ( !engineBase.size || engineBase.size < 0 ) {
            engineBase.size = '';
        }
        if ( !engineBase.cylinders || engineBase.cylinders < 0 ) {
            engineBase.cylinders = '';
        }
        const torque = this.getTorque( engineBase );
        const horsepower = this.getHorsepower( engineBase );

        const engineDetails = (
            <tbody>
            { this.buildSpecRow( 'Engine Type', engineBase.size + ' ' + engineBase.cylinders )}
            { this.buildSpecRow( 'Horsepower', horsepower, ' rpm' )}
            { this.buildSpecRow( 'Torque (lb-ft)', torque, ' rpm' )}
            </tbody>
        );

        return this.buildSpecTable( 'Engine', engineDetails );
    }

    buildWheelDetails() {
        // Still need to handle if front and rear tires are different sizes
        const wheelBase = this.props.overall.wheels;

        const wheelDetails = (
            <tbody>
            { this.buildSpecRow( 'Tires', wheelBase.tires )}
            { this.buildSpecRow( 'Rim Size', wheelBase.rimSize, ' in.' )}
            { this.buildSpecRow( 'Rims', wheelBase.rims )}
            { this.buildSpecRow( 'Spare Tire Type', wheelBase.spareTireType )}
            </tbody>
        );

        return this.buildSpecTable( 'Wheel', wheelDetails );
    }

    buildVehicleDetails() {
        const vehicleBase = this.props.overall.specifications;
        let vehicleDetails = null;

        if ( vehicleBase ) {
            vehicleDetails = (
                <tbody>
                { this.buildSpecRow( 'Wheelbase', vehicleBase.wheelbase, ' in.' )}
                { this.buildSpecRow( 'Height', vehicleBase.height, ' in.' )}
                { this.buildSpecRow( 'Max Gross Weight', vehicleBase.maxGrossWeight, ' lbs.' )}
                { this.buildSpecRow( 'Curb Weight', vehicleBase.curbWeight, ' lbs.' )}
                { this.buildSpecRow( 'Max Towing Capacity', vehicleBase.maxTowingCapacity, ' lbs.' )}
                </tbody>
            );
        }

        return this.buildSpecTable( 'Vehicle', vehicleDetails );
    }

    buildFuelDetails() {
        const fuelBase = this.props.overall.features.standardEngine;
        let fuelDetails = null;

        if ( fuelBase ) {
            fuelDetails = (
                <tbody>
                { this.buildSpecRow( 'Fuel Capacity', fuelBase.fuelCapacity, ' gal' )}
                </tbody>
            );
        }

        return this.buildSpecTable( 'Fuel', fuelDetails );
    }

    buildDrivetrainDetails() {
        const drivetrainBase = this.props.overall.features.standardDrivetrain;
        const drivetrainDetails = (
            <tbody>
            { this.buildSpecRow( 'Locking Differential', drivetrainBase.lockingDifferential )}
            { this.buildSpecRow( 'Driven Wheels', drivetrainBase.drivenWheels )}
            </tbody>
        );
        return this.buildSpecTable( 'Drivetrain', drivetrainDetails );
    }

    buildInteriorDetails() {
        const interiorBase = this.props.overall.specifications;
        const interiorDetails = (
            <tbody>
            { this.buildSpecRow( 'Seating Capacity', interiorBase.seatingCapacity)}
            { this.buildSpecRow( 'Front Headroom', interiorBase.frontHeadRoom, ' in.' )}
            { this.buildSpecRow( 'Front Legroom', interiorBase.frontLegRoom, ' in.' )}
            { this.buildSpecRow( 'Rear Headroom', interiorBase.rearHeadRoom, ' in.' )}
            { this.buildSpecRow( 'Rear Legroom', interiorBase.rearLegRoom, ' in.' )}
            </tbody>
        );
        return this.buildSpecTable( 'Interior', interiorDetails );
    }


    // SAFETY
    buildSafetyTableRows( standards, optionals ) {
        let totalItems = [];
        if ( !Array.isArray( optionals ) ) {
            optionals = [];
        }

        totalItems = standards.map((item, idx) => {
            return (
                <tr key={'std' + idx}>
                    <td className={this.props.labelColor}> { item.name }</td>
                    <td className={classnames('text-right', {'text-bold': this.props.isLabeValueBold})}>std</td>
                </tr>
            );
        });

        const optItems = optionals.map((item, idx) => {
            return (
                <tr key={'opt' + idx}>
                    <td className={this.props.labelColor}> { item.name }</td>
                    <td className={classnames('text-right', {'text-bold': this.props.isLabeValueBold})}>opt</td>
                </tr>
            );
        });

        totalItems = totalItems.concat( optItems );

        return totalItems;
    }

    buildSafetyRatings() {
        // Need to find a listing with safety details
        const safetyBase = this.props.overall.safetyRatings;
        let safetyDetails = null;
        const safetyRatingLabelGray = this.props.labelColor;
        if ( safetyBase ) {
            safetyDetails = (
                <tbody>
                    <tr data-qaid="cntnr-RolloverResistance">
                        <td className={safetyRatingLabelGray}>Rollover Resistance</td>
                        <td data-safety-rating={safetyBase.rolloverResistance}>
                            <StarRating
                                rating={safetyBase.rolloverResistance}
                                size="md"/></td>
                    </tr>
                    <tr data-qaid="cntnr-DriverCrashGrade">
                        <td className={safetyRatingLabelGray}>Driver Crash Grade</td>
                        <td data-safety-rating={safetyBase.driverCrashGrade}>
                            <StarRating
                                rating={safetyBase.driverCrashGrade}
                                size="md"/>
                        </td>
                    </tr>
                    <tr data-qaid="cntnr-PassengerCrashGrade">
                        <td className={safetyRatingLabelGray}>Passenger Crash Grade</td>
                        <td data-safety-rating={safetyBase.passengerCrashGrade}>
                            <StarRating
                                rating={safetyBase.passengerCrashGrade}
                                size="md"/>
                        </td>
                    </tr>
                    <tr data-qaid="cntnr-SideImpactCrashFront">
                        <td className={safetyRatingLabelGray}>Side Impact Crash Front</td>
                        <td data-safety-rating={safetyBase.sideImpactCrashFront}>
                            <StarRating
                                rating={ safetyBase.sideImpactCrashFront}
                                size="md"/>
                        </td>
                    </tr>
                    <tr data-qaid="cntnr-SideImpactCrashRear">
                        <td className={safetyRatingLabelGray}>Side Impact Crash Rear</td>
                        <td data-safety-rating={safetyBase.sideImpactCrashRear}>
                            <StarRating
                                rating={ safetyBase.sideImpactCrashRear}
                                size="md"/>
                        </td>
                    </tr>
                </tbody>
            );
        }

        if ( safetyDetails === null) {
            return ( <h3>No safety ratings available</h3> );
        }

        return this.buildSpecTable( 'Ratings', safetyDetails );
    }

    buildSafetyRatingsTwoCol() {
        const safetyBase = this.props.overall.safetyRatings;
        let safetyDetails = null;

        if ( safetyBase ) {
            safetyDetails = (
                <div>
                    <h2 className="text-md text-bold margin-vertical-sm margin-horizontal-sm"
                        data-qaid="cntnr-SafetyHeader">Safety Ratings</h2>
                    <div className="row">
                        <div className="col-md-6">
                            <Table className="table-condensed">
                                <tbody>
                                <tr data-qaid="cntnr-RolloverResistance">
                                    <td>Rollover Resistance</td>
                                    <td data-safety-rating={safetyBase.rolloverResistance}><StarRating
                                        size="md"
                                        rating={safetyBase.rolloverResistance} /></td>
                                </tr>
                                <tr data-qaid="cntnr-DriverCrashGrade">
                                    <td>Driver Crash Grade</td>
                                    <td data-safety-rating={safetyBase.driverCrashGrade}><StarRating
                                        size="md"
                                        rating={safetyBase.driverCrashGrade} /></td>
                                </tr>
                                <tr data-qaid="cntnr-PassengerCrashGrade">
                                    <td>Passenger Crash Grade</td>
                                    <td data-safety-rating={safetyBase.passengerCrashGrade}><StarRating
                                        size="md"
                                        rating={safetyBase.passengerCrashGrade} /></td>
                                </tr>
                                </tbody>
                            </Table>
                        </div>
                        <div className="col-md-6">
                            <Table className="table-condensed">
                                <tbody>
                                <tr data-qaid="cntnr-SideImpactCrashFront">
                                    <td>Side Impact Crash Front</td>
                                    <td data-safety-rating={safetyBase.sideImpactCrashFront}><StarRating
                                        size="md"
                                        rating={ safetyBase.sideImpactCrashFront} /></td>
                                </tr>
                                <tr data-qaid="cntnr-SideImpactCrashRear">
                                    <td>Side Impact Crash Rear</td>
                                    <td data-safety-rating={safetyBase.sideImpactCrashRear}><StarRating
                                        size="md"
                                        rating={ safetyBase.sideImpactCrashRear} /></td>
                                </tr>
                                </tbody>
                            </Table>
                        </div>
                    </div>
                </div>
            );
        }

        return safetyDetails;
    }

    buildStandardSafetyFeatures() {
        const stdFeatures = this.props.overall.features.standardSafetyFeatures;
        const optFeatures = this.props.overall.features.optionalSafetyFeatures;

        const rows = this.buildSafetyTableRows( stdFeatures, optFeatures);
        let stdFeaturesDetails = null;

        if ( stdFeatures ) {
            stdFeaturesDetails = (
                <tbody data-qaid="cntnr-AccidentPrevention">
                { rows }
                </tbody>
            );
        }
        return this.buildSpecTable( 'Accident Prevention', stdFeaturesDetails );

    }

    buildStandardSafetyFeaturesTwoCol() {
        const stdFeatures = this.props.overall.features.standardSafetyFeatures;
        const optFeatures = this.props.overall.features.optionalSafetyFeatures;

        return this.buildFeatureTable( 'Accident Prevention', stdFeatures, optFeatures );
    }


    // FEATURES
    buildNameCell( item ) {
        let name = null;
        if ( item ) {
            name = ( <td>{ item.name }</td> );
        }
        return name;
    }

    buildTypeCell( item ) {
        let type = null;
        if ( item && item.name) {
            const noSpaces = this.replaceAll( item.name, ' ', '' );
            const qName = this.replaceAll( noSpaces, '-', '' );
            type = ( <td
                className="text-bold"
                data-qaid={qName}>{ item.type }</td> );
        }
        return type;
    }

    buildMultiCellRows( std, opt ) {
        if ( !std ) {
            std = [];
        } else if ( !Array.isArray( std ) ) {
            const x = std;
            std = [];
            std.push( x );
        }

        if ( !opt ) {
            opt = [];
        }

        for ( let i = 0; i < std.length; i++ ) {
            std[i].type = 'std';
        }
        for ( let j = 0; j < opt.length; j++ ) {
            opt[j].type = 'opt';
        }
        const allItems = std.concat( opt );
        let rows = [];

        let count = allItems.length;
        while ( count-- ) {
            if ( !allItems[count].name ) {
                allItems.splice(count, 1);
            }
        }

        for ( let x = 0; x < allItems.length; x = x + 3 ) {
            rows.push( this.buildFeatureRow( allItems[x], allItems[x + 1], allItems[x + 2] ) );
        }

        if ( rows.length < 1 ) {
            rows = null;
        }

        return rows;
    }

    buildGenericFeatureSection( heading, rows ) {
        if ( !heading || !rows ) {
            return null;
        }

        const titleQaid = 'cntnr' + heading + 'Header';
        const bodyQaid = 'cntnr' + heading;

        return (
            <div>
                <h2 data-qaid= {titleQaid }>{ heading }</h2>
                <table>
                    <tbody data-qaid = { bodyQaid }>
                    { rows }
                    </tbody>
                </table>
            </div>
        );
    }

    buildBrakesFeatures() {
        const std = this.props.overall.features.standardBrakesFeatures;
        const rows = this.buildMultiCellRows( std );

        return this.buildGenericFeatureSection( 'Brakes', rows );
    }

    buildComfortFeatures() {
        const std = this.props.overall.features.standardComfortFeatures;
        const opt = this.props.overall.features.optionalComfortFeatures;

        const rows = this.buildMultiCellRows( std, opt );
        return this.buildGenericFeatureSection( 'Comfort', rows );
    }

    buildConvenienceFeatures() {
        const std = this.props.overall.features.standardConvenienceFeatures;
        const opt = this.props.overall.features.optionalConvenienceFeatures;

        const rows = this.buildMultiCellRows( std, opt );
        return this.buildGenericFeatureSection( 'Convenience', rows );
    }

    buildEntertainmentFeatures() {
        const std = this.props.overall.features.standardEntertainmentFeatures;
        const opt = this.props.overall.features.optionalEntertainmentFeatures;

        const rows = this.buildMultiCellRows( std, opt );
        return this.buildGenericFeatureSection( 'Entertainment', rows );
    }

    buildExteriorFeatures() {
        // const std = this.props.overall.features.standardExterior;
        // return this.buildMultiCellRows( std );

        return null;
    }

    buildOtherFeatures() {
        // const std = this.props.overall.features.standardOtherFeatures;
        // const opt = this.props.overall.features.optionalOtherFeatures;

        // return this.buildMultiCellRows( std, opt );

        return null;
    }

    buildPackageFeatures() {
        const std = [];
        const opt = this.props.overall.features.optionalPackageFeatures;

        const rows = this.buildMultiCellRows( std, opt );
        return this.buildGenericFeatureSection( 'Package', rows );
    }

    buildPowerFeatures() {
        // const std = this.props.overall.features.standardPower;
        // const opt = this.props.overall.features.optionalPower;

        // return this.buildMultiCellRows( std, opt );

        return null;
    }

    buildSafetyFeatures() {
        const std = this.props.overall.features.standardSafetyFeatures;
        const opt = this.props.overall.features.optionalSafetyFeatures;

        const rows = this.buildMultiCellRows( std, opt );
        return this.buildGenericFeatureSection( 'Safety', rows );
    }

    buildSeatFeatures() {
        const std = [];
        const opt = this.props.overall.features.optionalSeatFeatures;

        const rows = this.buildMultiCellRows( std, opt );
        return this.buildGenericFeatureSection( 'Seat', rows );
    }

    buildTowingFeatures() {
        const std = [];
        const opt = this.props.overall.features.optionalTowingFeatures;

        const rows = this.buildMultiCellRows( std, opt );
        return this.buildGenericFeatureSection( 'Towing', rows );
    }

    buildWheelFeatures() {
        const std = [];
        const opt = this.props.overall.features.optionalWheelFeatures;

        const rows = this.buildMultiCellRows( std, opt );
        return this.buildGenericFeatureSection( 'Wheel', rows );
    }


    // SECTIONS
    buildOverview() {
        let overviewDisplay = '';

        if ( this.props.overall && this.props.overall.overview ) {
            overviewDisplay = (
                <div
                    className="margin-vertical-sm"
                    data-qaid="cntnr-summary-description">
                    { this.props.overall.overview }
                </div>
            );
        }

        return overviewDisplay;
    }

    getTorque( engineBase ) {
        let torque = '';
        if ( engineBase.torque && engineBase.torque > 0 && engineBase.torqueAt && engineBase.torqueAt > 0) {
            torque = engineBase.torque + ' @ ' + engineBase.torqueAt;
        }

        return torque;
    }

    getHorsepower( engineBase ) {
        let horsepower = '';
        const hybrid = engineBase.horsepowerAt && engineBase.horsepowerAt.indexOf('combined') > 0;

        if ( engineBase.horsepower && engineBase.horsepower > 0 && engineBase.horsepowerAt && (hybrid || engineBase.horsepowerAt > 0 )) {
            horsepower = engineBase.horsepower + ' @ ' + engineBase.horsepowerAt;
        }

        return horsepower;
    }

    buildSpecifications() {
        if ( !this.props.overall.features ) {
            return null;
        }

        let layout = null;

        if ( !this.props.useTwoColumn ) {
            layout = (
                <div>
                    <h2 className="text-md text-bold margin-vertical-md">
                        Specifications
                    </h2>

                    <div className="row">
                        <div className="col-md-4">
                            { this.buildEngineDetails() }
                        </div>

                        <div className="col-md-4">
                            { this.buildWheelDetails() }
                        </div>

                        <div className="col-md-4">
                            { this.buildVehicleDetails() }
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-4">
                            { this.buildFuelDetails() }
                        </div>

                        <div className="col-md-4">
                            { this.buildDrivetrainDetails() }
                        </div>

                        <div className="col-md-4">
                            { this.buildInteriorDetails() }
                        </div>
                    </div>
                </div>
            );
        } else {
            const engineBase = this.props.overall.features.standardEngine;
            const wheelBase = this.props.overall.wheels;
            const drivetrainBase = this.props.overall.features.standardDrivetrain;
            const vehicleBase = this.props.overall.specifications;
            const horsepower = this.getHorsepower( engineBase );
            const torque = this.getTorque( engineBase );

            layout = (
                <div>
                    <h2 className="text-md text-bold margin-vertical-sm">
                        Specifications
                    </h2>

                    <div className="row">
                        <div className="col-md-6">
                            <Table className="table-condensed">
                                <tbody>
                                { this.buildSpecRow( 'Fuel Capacity', engineBase.fuelCapacity, 'gal' ) }
                                { this.buildSpecRow( 'Engine Type', engineBase.size + ' ' + engineBase.cylinders ) }
                                { this.buildSpecRow( 'Horsepower', horsepower, ' rpm' )}
                                { this.buildSpecRow( 'Torque (lb-ft)', torque, ' rpm' )}
                                { this.buildSpecRow( 'Tires', wheelBase.tires ) }
                                { this.buildSpecRow( 'Rim Size', wheelBase.rimSize, ' in.' ) }
                                { this.buildSpecRow( 'Rims', wheelBase.rims ) }
                                { this.buildSpecRow( 'Spare Tire Type', wheelBase.spareTireType ) }
                                { this.buildSpecRow( 'Front Headroom', vehicleBase.frontHeadRoom, ' in.' )}
                                { this.buildSpecRow( 'Front Legroom', vehicleBase.frontLegRoom, ' in.' )}
                                </tbody>
                            </Table>
                        </div>
                        <div className="col-md-6">
                            <Table className="table-condensed">
                                <tbody>
                                { this.buildSpecRow( 'Locking Differential', drivetrainBase.lockingDifferential)}
                                { this.buildSpecRow( 'Max Towing Capacity', vehicleBase.maxTowingCapacity, ' lbs.' )}
                                { this.buildSpecRow( 'Driven Wheels', drivetrainBase.drivenWheels ) }
                                { this.buildSpecRow( 'Curb Weight', vehicleBase.curbWeight, ' lbs.' ) }
                                { this.buildSpecRow( 'Max Gross Weight', vehicleBase.maxGrossWeight, ' lbs.' ) }
                                { this.buildSpecRow( 'Wheelbase', vehicleBase.wheelbase, ' in.' ) }
                                { this.buildSpecRow( 'Height', vehicleBase.height, ' in.' ) }
                                { this.buildSpecRow( 'Seating Capacity', vehicleBase.seatingCapacity)}
                                { this.buildSpecRow( 'Rear Headroom', vehicleBase.rearHeadRoom, ' in.' )}
                                { this.buildSpecRow( 'Rear Legroom', vehicleBase.rearLegRoom, ' in.' )}
                                </tbody>
                            </Table>
                        </div>
                    </div>
                </div>
            );
        }

        return layout;
    }

    buildSafety() {
        if ( !this.props.overall.features ) {
            return null;
        }

        let safety = null;
        if ( !this.props.useTwoColumn ) {

            const qaid = 'cntnr-SafetyHeader';
            safety = (
                <div className="row">
                    <h2 className="text-md text-bold margin-vertical-md"
                        data-qaid={ qaid }>Safety</h2>
                    <div className="col-md-6">
                        { this.buildSafetyRatings() }
                    </div>

                    <div className="col-md-6">
                        { this.buildStandardSafetyFeatures() }
                    </div>
                </div>
            );
        } else {
            safety = (
                <div>
                    { this.buildSafetyRatingsTwoCol() }
                    { this.buildStandardSafetyFeaturesTwoCol() }
                </div>
            );
        }

        return safety;
    }

    buildFeatures() {
        if ( !this.props.overall.features ) {
            return null;
        }

        let featuresFull = null;

        const stdBrakes = this.props.overall.features.standardBrakesFeatures;
        const stdComfort = this.props.overall.features.standardComfortFeatures;
        const optComfort = this.props.overall.features.optionalComfortFeatures;
        const stdConvenience = this.props.overall.features.standardConvenienceFeatures;
        const optConvenience = this.props.overall.features.optionalConvenienceFeatures;
        const stdEntertainment = this.props.overall.features.standardEntertainmentFeatures;
        const optEntertainment = this.props.overall.features.optionalEntertainmentFeatures;
        // const stdExterior = this.props.overall.features.standardExterior;
        // { this.buildFeatureTable( "Exterior", stdExterior, optExterior ) }
        // const stdOther = this.props.overall.features.standardOtherFeatures;
        // const optOther = this.props.overall.features.optionalOtherFeatures;
        // { this.buildFeatureTable( "Other", stdOther, optOther ) }
        const stdPackage = [];
        const optPackage = this.props.overall.features.optionalPackageFeatures;
        // const stdPower = this.props.overall.features.standardPower;
        // const optPower = this.props.overall.features.optionalPower;
        // { this.buildFeatureTable( "Power", stdPower, optPower ) }
        // const stdSafety = this.props.overall.features.standardSafetyFeatures;
        // const optSafety = this.props.overall.features.optionalSafetyFeatures;
        const stdSeat = [];
        const optSeat = this.props.overall.features.optionalSeatFeatures;
        const stdTowing = [];
        const optTowing = this.props.overall.features.optionalTowingFeatures;
        const stdWheel = [];
        const optWheel = this.props.overall.features.optionalWheelFeatures;

        featuresFull = (
            <div>
                { this.buildFeatureTable( 'Brakes', stdBrakes ) }
                { this.buildFeatureTable( 'Comfort', stdComfort, optComfort ) }
                { this.buildFeatureTable( 'Convenience', stdConvenience, optConvenience ) }
                { this.buildFeatureTable( 'Entertainment', stdEntertainment, optEntertainment ) }
                { this.buildFeatureTable( 'Package', stdPackage, optPackage ) }

                { this.buildFeatureTable( 'Seat', stdSeat, optSeat ) }
                { this.buildFeatureTable( 'Towing', stdTowing, optTowing ) }
                { this.buildFeatureTable( 'Wheel', stdWheel, optWheel ) }
            </div>
        );

        return featuresFull;
    }

    render() {
        return this.props.overall && (
            <div className="row">
                <div className="col-xs-12">
                     <h2 className="text-md text-bold margin-vertical-md"
                         data-qaid="cntnr-modeldetail-vehicle-title">
                        <VehicleTitle
                            title={ListingsStore.getState().listings[0].title}
                            trim={ListingsStore.getState().listings[0].trim} />
                    </h2>
                    <div data-qaid="cntnr-md-disclaimer">
                        { this.props.overall.disclaimerText }
                    </div>

                        <div>
                            { this.buildOverview() }
                        </div>

                        <div className="margin-vertical-lg">
                            { this.buildSpecifications() }
                        </div>

                        <div className="margin-vertical-lg">
                            { this.buildSafety() }
                        </div>

                        <div className="margin-vertical-lg">
                            { this.buildFeatures() }
                        </div>
                    </div>
                </div>
            );
    }
}

ModelDetails.propTypes = {
    overall: React.PropTypes.object,
    getTabContent: React.PropTypes.func,
    listingId: React.PropTypes.string,
    labelColor: React.PropTypes.string,
    isLabeValueBold: React.PropTypes.bool,
};

ModelDetails.defaultProps = {
    overall: null,
    getTabContent: () => {},
    listingId: '',
    labelColor: '',
    isLabeValueBold: false,
};

export default ModelDetails;
