import { h, Component } from 'preact';
import style from './style.css';
const pathToCards = require.context('../../assets/svg-cards', true);

function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function Card({ data, suit, ...props }) {
    // modulo 13 places the number in range of a suit
    // adding 2 gives us an easy way to place the index into the face cards
    let number = (data.place%13)+2;

    if (number == 11) {
        number = 'jack';
    } else if (number == 12) {
        number = 'queen';
    } else if (number == 13) {
        number = 'king'
    } else if (number == 14) {
        number = 'ace'
    }
    const path = `./${number}_of_${suit}.svg`;
    return (<img src={pathToCards(path, true)} {...props} />);
}

export function LargeCard ({ card }) {

    let suit;

    if (card.place >= 0 && card.place < 13) {
        suit = Suit.HEARTS;
    } else if (card.place >= 13 && card.place < 26) {
        suit = Suit.SPADES;
    } else if (card.place >= 26 && card.place < 39) {
        suit = Suit.DIAMONDS;
    } else {
        suit = Suit.CLUBS;
    }

    return (
        <div class={style.row}>
            <Card data={card} suit={suit} class={style.largeCard} />
        </div>
    );
}

const ViewState = {
    ALL_CARDS: 0,
    LARGE_CARD: 1,
};

const Suit = {
    HEARTS: 'hearts',
    SPADES: 'spades',
    DIAMONDS: 'diamonds',
    CLUBS: 'clubs',
}

export default class Host extends Component {
    state = {
        time: Date.now(),
        count: -1,
        deck: shuffle(Array(52).fill(false).map((e, i) => ({value: e, place: i}))),
        board: Array(52).fill(),
        viewState: ViewState.ALL_CARDS,
        tick: 0,
    };

    // update the current time
    updateTime = () => {
        let {
            tick: newTick,
            viewState: newViewState
        } = this.state;

        if (newTick > 0) {
            newTick--;
        }

        if (newTick === 0) {
            newViewState = ViewState.ALL_CARDS
        }

        this.setState({ time: Date.now(), tick: newTick, viewState: newViewState });
    };

    increment = () => {
        // draw the next card
        const next = this.state.count + 1;
        let deck = [...this.state.deck];

        // change the value to "seen" as reference for the board
        let card = { ...deck[next], value: true };
        deck[next] = card;

        // determine where on the board the card will be displayed
        let board = [...this.state.board];
        board[card.place] = card;

        this.setState({
            count: this.state.count + 1,
            deck,
            board,
            tick: 5,
            viewState: ViewState.LARGE_CARD
        });
    };

    // gets called when this route is navigated to
    componentDidMount() {
        // start a timer for the clock:
        this.timer = setInterval(this.updateTime, 1000);
    }

    // gets called just before navigating away from the route
    componentWillUnmount() {
        clearInterval(this.timer);
    }

    cards = (slice, suit) => slice.map((e, i) => {
        if (e) {
            return (<Card data={e} suit={suit} class={style.card} />);
        }

        return (
            <p class={`${style.aligner} ${style.card}`} key={i}>
                <span class={style.alignedItem}>-</span>
            </p>);
    });

    renderRow() {
        const hearts = this.cards(this.state.board.slice(0, 13), Suit.HEARTS);
        const spades = this.cards(this.state.board.slice(13, 26), Suit.SPADES);
        const diamonds = this.cards(this.state.board.slice(26, 39), Suit.DIAMONDS);
        const clubs = this.cards(this.state.board.slice(39, 52), Suit.CLUBS);

        return <div>
            <div class={style.row}>{hearts}</div>
            <div class={style.row}>{spades}</div>
            <div class={style.row}>{diamonds}</div>
            <div class={style.row}>{clubs}</div>
        </div>;
    }

    render(_, { count, deck, viewState }) {
        return (
            <div class={style.profile}>
                <p>
                    <button onClick={this.increment}>Draw Card</button>
                    {' '}
                    Cards drawn: {count+1}.
                </p>
                {viewState === ViewState.LARGE_CARD ? <LargeCard card={deck[count]} /> : this.renderRow()}
            </div>
        );
    }
}
