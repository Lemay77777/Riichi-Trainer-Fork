import React from 'react';
import { ListGroupItem, Collapse, Row, Col } from 'reactstrap';
import { withTranslation } from 'react-i18next';
import UkeireHistoryData from './ukeire-quiz/UkeireHistoryData';
import { getTileAsText, getTileImage } from '../scripts/TileConversions';

class HistoryMessage extends React.Component {
    /* PROPS
        data (HistoryData),
        verbose,
        concise,
        spoilers
    */
    constructor(props) {
        super(props);
        this.state = { collapsed: true };
    }

    componentDidMount() {
        this.setState({
            collapsed: false
        });
    }

    renderTileImage(tileIndex, altText) {
        return (
            <img
                src={getTileImage(tileIndex)}
                alt={altText}
                title={altText}
                style={{
                    height: '1.8em',
                    verticalAlign: 'middle',
                    margin: '0 2px',
                    borderRadius: '2px',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.15)'
                }}
            />
        );
    }

    renderStructuredResponse(t, data) {
        const { verbose, spoilers } = this.props;
        const mode = verbose ? 'verbose' : 'concise';
        const chosenTileText = getTileAsText(t, data.chosenTile, verbose);
        const bestTileText = getTileAsText(t, data.bestTile, verbose);
        const drawnTileText = data.drawnTile !== -1 ? getTileAsText(t, data.drawnTile, verbose) : null;

        const isOptimal = data.chosenUkeire.value === data.bestUkeire.value;
        const containerClass = 'ukeire-history-entry p-2 text-left text-dark';

        return (
            <div className={containerClass} style={{ fontSize: '1.1rem' }}>
                <Row className="align-items-center mb-2">
                    <Col xs="12" md="6" className="d-flex flex-wrap align-items-center">
                        <span className="mr-2 mb-1 d-flex align-items-center text-dark">
                            {t("history.discardedLabel")}: {this.renderTileImage(data.chosenTile, chosenTileText)}
                        </span>
                        {isOptimal ? (
                            <span className="badge badge-success text-dark px-2 py-1 rounded-pill mb-1" style={{ fontSize: '0.9rem' }}>
                                {t(`history.${mode}.best`)}
                            </span>
                        ) : (
                            <span className="badge badge-warning text-dark px-2 py-1 rounded-pill mb-1" style={{ fontSize: '0.9rem' }}>
                                {t("history.suboptimalDiscard")}
                            </span>
                        )}
                    </Col>
                    <Col xs="12" md="6" className="text-md-right mt-1 mt-md-0 d-flex align-items-center justify-content-md-end flex-wrap">
                        {drawnTileText && (
                            <span className="badge badge-info text-dark px-2 py-1 rounded-pill mr-2 mb-1 d-inline-flex align-items-center" style={{ fontSize: '0.9rem' }}>
                                <span className="mr-1">{t("history.drawLabel")}:</span>
                                {this.renderTileImage(data.drawnTile, drawnTileText)}
                            </span>
                        )}
                        <span className="badge badge-secondary text-dark px-2 py-1 rounded-pill mb-1" style={{ fontSize: '0.9rem' }}>
                            {t("history.shantenLabel")}: <strong>{data.shanten}</strong>
                        </span>
                    </Col>
                </Row>

                <div className="ukeire-details border-top pt-2 mt-2">
                    <Row>
                        <Col xs="12" md={spoilers && !isOptimal ? "6" : "12"} className="mb-2 mb-md-0">
                            <div className="p-2 rounded" style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}>
                                <div className="font-weight-bold text-decoration-underline mb-1 d-flex align-items-center flex-wrap">
                                    <span className="mr-1">{t("history.yourDiscard")}</span>
                                    {this.renderTileImage(data.chosenTile, chosenTileText)}
                                </div>
                                <div>Acceptance: <strong>{data.chosenUkeire.value}</strong> {data.chosenUkeire.value === 1 ? 'tile' : 'tiles'}</div>
                                {data.chosenUkeire.value > 0 && (
                                    <div className="mt-2" style={{ opacity: 0.8 }}>
                                        <div className="font-weight-bold mb-1" style={{ fontSize: '0.85rem' }}>Tiles:</div>
                                        <div className="d-flex flex-wrap align-items-center mt-1">
                                            {data.chosenUkeire.tiles.map((tile, idx) => (
                                                <span key={idx} className="d-inline-block">
                                                    {this.renderTileImage(tile, getTileAsText(t, tile, verbose))}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Col>
                        {spoilers && !isOptimal && (
                            <Col xs="12" md="6">
                                <div className="p-2 rounded border border-success" style={{ backgroundColor: 'rgba(40, 167, 69, 0.1)' }}>
                                    <div className="font-weight-bold text-success mb-1 d-flex align-items-center flex-wrap">
                                        <span className="mr-1">{t("history.optimalDiscard")}</span>
                                        {this.renderTileImage(data.bestTile, bestTileText)}
                                    </div>
                                    <div>Acceptance: <strong>{data.bestUkeire.value}</strong> {data.bestUkeire.value === 1 ? 'tile' : 'tiles'}</div>
                                    {data.bestUkeire.value > 0 && (
                                        <div className="mt-2" style={{ opacity: 0.8 }}>
                                            <div className="font-weight-bold text-success mb-1" style={{ fontSize: '0.85rem' }}>Tiles:</div>
                                            <div className="d-flex flex-wrap align-items-center mt-1">
                                                {data.bestUkeire.tiles.map((tile, idx) => (
                                                    <span key={idx} className="d-inline-block">
                                                        {this.renderTileImage(tile, getTileAsText(t, tile, verbose))}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </Col>
                        )}
                    </Row>

                    {!isOptimal && (
                        <Row className="mt-3 pt-3 border-top">
                            <Col xs="12">
                                <div className="p-2 rounded" style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)', borderLeft: '4px solid #17a2b8' }}>
                                    <div className="font-weight-bold mb-2 text-decoration-underline">Difference (Ukeire Comparison)</div>
                                    <Row>
                                        <Col xs="12" md="6" className="mb-2 mb-md-0">
                                            <div>
                                                <span className="badge badge-success text-dark px-2 py-1 rounded-pill mb-2 d-inline-block" style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>
                                                    + Gained by Optimal Play
                                                </span>
                                                <div className="d-flex flex-wrap align-items-center mt-1">
                                                    {(() => {
                                                        const chosenTiles = data.chosenUkeire.tiles || [];
                                                        const bestTiles = data.bestUkeire.tiles || [];
                                                        const missedTiles = bestTiles.filter(tile => !chosenTiles.includes(tile));
                                                        return missedTiles.length > 0 ? (
                                                            missedTiles.map((tile, idx) => (
                                                                <span key={idx} className="d-inline-block">
                                                                    {this.renderTileImage(tile, getTileAsText(t, tile, verbose))}
                                                                </span>
                                                            ))
                                                        ) : (
                                                            <span className="text-muted" style={{ fontSize: '0.85rem' }}>None</span>
                                                        );
                                                    })()}
                                                </div>
                                            </div>
                                        </Col>
                                        <Col xs="12" md="6">
                                            <div>
                                                <span className="badge badge-danger text-dark px-2 py-1 rounded-pill mb-2 d-inline-block" style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>
                                                    - Unique to Your Play
                                                </span>
                                                <div className="d-flex flex-wrap align-items-center mt-1">
                                                    {(() => {
                                                        const chosenTiles = data.chosenUkeire.tiles || [];
                                                        const bestTiles = data.bestUkeire.tiles || [];
                                                        const uniqueTiles = chosenTiles.filter(tile => !bestTiles.includes(tile));
                                                        return uniqueTiles.length > 0 ? (
                                                            uniqueTiles.map((tile, idx) => (
                                                                <span key={idx} className="d-inline-block">
                                                                    {this.renderTileImage(tile, getTileAsText(t, tile, verbose))}
                                                                </span>
                                                            ))
                                                        ) : (
                                                            <span className="text-muted" style={{ fontSize: '0.85rem' }}>None</span>
                                                        );
                                                    })()}
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                            </Col>
                        </Row>
                    )}
                </div>
            </div>
        );
    }

    render() {
        let { t } = this.props;
        if (!this.props.data) return <ListGroupItem></ListGroupItem>;

        const isUkeire = this.props.data instanceof UkeireHistoryData;

        let message = this.props.data.getMessage(t, this.props.concise, this.props.verbose, this.props.spoilers);
        let messageRows = message.split("<br/>").map((message, index) => <Row key={index}>{message}</Row>)

        return (
            <Collapse isOpen={!this.state.collapsed}>
                <ListGroupItem className={this.props.data.getClassName()}>
                    {isUkeire ? (
                        this.renderStructuredResponse(t, this.props.data)
                    ) : (
                        messageRows
                    )}
                    {this.props.data.hand ? <a className="tenhouLink d-block mt-2 text-right" href={"http://tenhou.net/2/?q=" + this.props.data.hand} target="_blank" rel="noopener noreferrer">
                        {t("history.tenhouLinkText")}
                    </a> : ""}
                </ListGroupItem>
            </Collapse>
        );
    }
}

export default withTranslation()(HistoryMessage);