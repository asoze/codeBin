import React from 'react';
import AltContainer from 'alt-container';

// Bootstrap Components
import Button from 'react-bootstrap/lib/Button';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import Well from 'react-bootstrap/lib/Well';

// Custom Components
import DealerName from 'pieces/vehicledetails/DealerName';
import DealerLogo from 'pieces/vehicledetails/DealerLogo';
import DealerRater from 'pieces/vehicledetails/DealerRater';
import DealerChat from 'pieces/vehicledetails/DealerChat';
import DealerAddressTwoColumn from 'pieces/vehicledetails/DealerAddressTwoColumn';
import TIMTileDisplay from 'pieces/vehicledetails/TIMTileDisplay';
import DealerInventory from 'pieces/vehicledetails/DealerInventory';
import SellerPhone from 'pieces/vehicledetails/SellerPhone';
import ViewCounter from 'pieces/vehicledetails/ViewCounter';
import VehicleDetailsAnalytics from 'analytics/VehicleDetailsAnalytics';

// Stores
import BirfStore from 'stores/BirfStore';
import ContentStore from 'stores/ContentStore';
import SocialMediaStore from 'stores/SocialMediaStore';
import DealerChatStore from 'stores/DealerChatStore';
import ListingsStore from 'stores/ListingsStore';
import MVTFeatureParametersStore from 'stores/MVTFeatureParametersStore';

class SellerModuleTwoColumn extends React.Component {

    renderDealerLogo() {
        return this.props.listing.logoTile && (
                <DealerLogo
                    listing={this.props.listing}
                    clickable={ContentStore.state.content.dealerLogoClickable}
                    viewable={ContentStore.state.content.dealerLogoViewable}
                    z={ListingsStore.state.listingZip}
                    imageClassName="margin-vertical-sm margin-collapse-top"
                />
            );
    }

    renderDealerName() {
        return (
            <DealerName listing={this.props.listing}
                        className="margin-vertical-sm margin-collapse-top text-bold"/>
        );
    }

    renderDealerRater() {
        return !this.props.listing.privateSeller && (
            ContentStore.state.content.ownerRatingsLinkViewable &&
            <DealerRater ownerRatings={ContentStore.state.content.dealerRaterLink}/>
        );
    }

    renderTextLabel() {
        return this.props.listing.ownerTextLabel && (
                <div>{this.props.listing.ownerTextLabel}</div>
            );
    }

    renderSellerPhone() {
        return ContentStore.state.content.ownerPhoneSectionViewable && (
                <SellerPhone sellerPhone={this.props.listing.ownerPhone}
                             sellerId={this.props.listing.ownerId}
                             listingId={this.props.listing.listingId}
                             sellerPhoneLinkText={ContentStore.state.content.sellerPhoneLinkText}
                             ownerPhoneIsVisible={this.props.listing.ownerPhoneVisible}
                             className="margin-vertical-sm"
                             isFlat/>
            );
    }

    renderDealerChat() {
        return (this.props.listing.ownerChatTile && !this.props.listing.privateSeller) && (
                <AltContainer
                    component={DealerChat}
                    stores={[DealerChatStore]}
                    inject={{
                        content: () => this.props.listing.ownerChatTile,
                        originationUrl: () => SocialMediaStore.state.currentPageUrl,
                        dealerAvailability: () => DealerChatStore.state.isOnline,
                        chatButton: true,
                    }}
                />
            );
    }

    renderSellerAddress() {
        const location = this.props.listing && this.props.listing.location;
        const mapUrl = location ? 'https://maps.google.com/maps/place/' + location.address1 + ',' + location.city + ',' + location.state + ' ' + location.zip : '';
        const extra = {
            novs: 'n',
            v: this.props.listing.listingId,
            c: this.props.listing.ownerId,
        };
        return (
            <DealerAddressTwoColumn
                url={mapUrl}
                listing={this.props.listing}
                addressClickable={ContentStore.state.content.addressClickable}
                birfExtra={extra}
            />
        );
    }

    renderDealerInventory() {
        return !this.props.listing.privateSeller && (
                <DealerInventory
                    className="margin-vertical-sm"
                    glyph="atcar"
                    listing={this.props.listing}
                    hertzLinkViewable={ContentStore.state.content.hertzLinkViewable}
                    inventoryLinkViewable={ContentStore.state.content.inventoryLinkViewable}
                    currentOffersText={"View dealer inventory"}
                    inventoryText={ContentStore.state.content.inventoryLinkText}
                    ct={BirfStore.state.birfCt}
                    data-qaid="cntnr-dlr-inventory"
                />
            );
    }

    renderTIMTile() {
        return (ContentStore.state.content.tradeInMarketTileViewable && this.props.listing.tradeInMarketTile) &&
            !this.props.listing.privateSeller && (
                <div>
                    <hr className="margin-vertical-md"/>
                    <TIMTileDisplay
                        tile={this.props.listing.tradeInMarketTile.tileBean}
                        listing={this.props.listing}
                        z={ListingsStore.state.listingZip}
                    />
                </div>
            );
    }

    renderWebsiteButton() {
        let websiteButtonHref = null;
        let websiteButtonCmp = null;
        const buttonText = 'Visit Dealer Website';

        if (ContentStore.state.content.prominentWebsiteTileViewable) {
            websiteButtonHref = this.props.listing.prominentWebsiteTile.link;
            websiteButtonCmp = 'vw_wb_btn';
        } else if (ContentStore.state.content.siteLinkViewable) {
            websiteButtonHref = this.props.listing.siteLink.link;
            websiteButtonCmp = 'vis_web';
        }

        return (!this.props.listing.privateSeller && websiteButtonHref) && (
                <Button className="margin-vertical-md"
                        rel="nofollow"
                        href={websiteButtonHref}
                        target="_blank"
                        data-qaid="btn-vis-web"
                    {...VehicleDetailsAnalytics.getCommonBirf(websiteButtonCmp, null, {
                        c: this.props.listing.ownerId,
                        v: this.props.listing.listingId,
                        z: this.props.listing.ownerZip,
                    })}
                        block>
                    { buttonText }
                    <Glyphicon
                        className="text-sm margin-horizontal-sm margin-collapse-right"
                        glyph="offsite"/>
                </Button>
            );
    }

    renderViewCounter() {
        return this.props.listing.privateSeller && (
                (this.props.listing.viewCount) && (
                    <div>
                        <hr className="margin-vertical-sm"/>
                        <ViewCounter
                            views={this.props.listing.viewCount}
                            text={this.props.listing.wantExposureDescription}
                            url={this.props.listing.sellCarLink.link}
                            linkText={this.props.listing.sellCarLink.text}
                            className="padding-vertical-sm collapse-padding-top"/>
                    </div>
                )
            );
    }

    render() {
        return (
            <Well>
                <div className="row">
                    <div className="col-xs-4 margin-vertical-sm">{this.renderDealerLogo()}</div>
                    <div className="col-xs-8">
                        {this.renderDealerRater()}
                    </div>
                </div>
                {this.renderDealerName()}
                {MVTFeatureParametersStore.state.enableTextToDealerSlide && this.renderTextLabel()}
                {this.renderSellerPhone()}
                {ContentStore.state.content.mapLinkViewable && this.renderSellerAddress()}

                {this.renderViewCounter()}
                {this.renderWebsiteButton()}
                {this.renderDealerChat()}
                {this.renderTIMTile()}
            </Well>
        );
    }
}

SellerModuleTwoColumn.defaultProps = {};

SellerModuleTwoColumn.propTypes = {
    listing: React.PropTypes.object,
};

export default SellerModuleTwoColumn;
