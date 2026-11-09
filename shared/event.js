/* Single source of truth for both voter pages, the big screen and the admin panel.
   Facts below come from the event poster (Instagram, Oct 2026). Vote counts are
   sample data for the prototype. */
window.CJC = (function () {

  const EVENT = {
    presenter : "Friends of the Iron County Children's Justice Center",
    name      : 'Dancing with the Community Stars',
    theme     : 'Battle of the Bands',
    beneficiary: "Iron County Children's Justice Center",
    tagline   : 'Where small voices are heard',
    dateLong  : 'Tuesday, November 17',
    showTime  : '7:00 PM',
    lobby     : '6:00 PM',
    house     : '6:30 PM',
    venue     : 'Heritage Center Theatre',
    address   : '105 N 100 E, Cedar City',
    ticket    : 15,
    contact   : { name: 'Jennifer Davis', role: 'Iron County CJC Friends Board', phone: '435-590-1317' },
    goal      : 120000,

    /* What decides the winner.

       'dollars' ranks on money actually raised. 'votes' ranks on vote count,
       which includes bundle bonus votes and the free vote.

       Default is 'dollars' on purpose. The free vote cannot be locked to a
       device in any way a determined person cannot beat in ten seconds with a
       private browsing window, so the honest fix is to make a farmed free vote
       worth nothing to the outcome. A free vote raises $0, so under 'dollars'
       it moves no one up the board. Switch to 'votes' only if the board
       decides vote count is the story they want to tell. */
    rankBy    : 'dollars'
  };

  /* Eight community stars, from the poster. Both figures are sample data.

     votes and dollars are tracked separately and MUST NOT be conflated:
       - a free vote is 1 vote and $0
       - a $20 bundle is 25 votes and $20, because of the bonus votes
     So the money shown to the room is always sum(dollars), never sum(votes).
     Standings, where they are shown at all, rank on votes. */
  /* cashGifts / onlineGifts count PEOPLE, not dollars: one gift is one giver.
     cash  = handed to a volunteer at a table (cash, check or a pledge slip)
     online = card, digital wallet or Venmo
     freeVotes are the one-per-device votes, worth $0. */
  const DANCERS = [
    { id:1, slug:'riley-taylor',      name:'Riley Taylor',      votes:4120, freeVotes:180, cashGifts:22, cashDollars:980, onlineGifts:64, onlineDollars:2100 },
    { id:2, slug:'latosha-anderson',  name:'Latosha Anderson',  votes:3870, freeVotes:164, cashGifts:19, cashDollars:910, onlineGifts:58, onlineDollars:1980 },
    { id:3, slug:'mirryn-morrill',    name:'Mirryn Morrill',    votes:3655, freeVotes:151, cashGifts:17, cashDollars:820, onlineGifts:55, onlineDollars:1910 },
    { id:4, slug:'nicole-funderburk', name:'Nicole Funderburk', votes:3290, freeVotes:138, cashGifts:16, cashDollars:760, onlineGifts:49, onlineDollars:1700 },
    { id:5, slug:'rochell-topham',    name:'Rochell Topham',    votes:2980, freeVotes:126, cashGifts:15, cashDollars:690, onlineGifts:44, onlineDollars:1535 },
    { id:6, slug:'dave-mcintyre',     name:'Dave McIntyre',     votes:2645, freeVotes:109, cashGifts:21, cashDollars:835, onlineGifts:33, onlineDollars:1140 },
    { id:7, slug:'brady-williams',    name:'Brady Williams',    votes:2310, freeVotes:97,  cashGifts:11, cashDollars:505, onlineGifts:35, onlineDollars:1220 },
    { id:8, slug:'declan-mcginty',    name:'Declan McGinty',    votes:1905, freeVotes:88,  cashGifts:8,  cashDollars:330, onlineGifts:31, onlineDollars:1090 }
  ];

  /* dollars is DERIVED, never stored. This is the guard against the bug where
     the public total summed votes: there is no d.dollars to assign to, so a
     gift has to be written into the bucket it actually came from. */
  DANCERS.forEach(d => Object.defineProperty(d, 'dollars', {
    enumerable: true,
    get(){ return d.cashDollars + d.onlineDollars; }
  }));

  /* The one place a gift is recorded. channel is 'free', 'cash' or 'online'. */
  function record(dancer, { votes = 0, amount = 0, channel = 'online', gifts = 1 }){
    const d = typeof dancer === 'string' ? DANCERS.find(x => x.name === dancer) : dancer;
    if (!d) return null;
    d.votes += votes;
    if (channel === 'free'){ d.freeVotes += votes; return d; }
    if (channel === 'cash'){ d.cashDollars   += amount; d.cashGifts   += gifts; }
    else                   { d.onlineDollars += amount; d.onlineGifts += gifts; }
    return d;
  }

  const paidVotes = d => d.votes - d.freeVotes;
  const totals = () => DANCERS.reduce((t, d) => ({
    dollars:     t.dollars     + d.dollars,
    votes:       t.votes       + d.votes,
    freeVotes:   t.freeVotes   + d.freeVotes,
    cashGifts:   t.cashGifts   + d.cashGifts,
    cashDollars: t.cashDollars + d.cashDollars,
    onlineGifts: t.onlineGifts + d.onlineGifts,
    onlineDollars: t.onlineDollars + d.onlineDollars
  }), { dollars:0, votes:0, freeVotes:0, cashGifts:0, cashDollars:0, onlineGifts:0, onlineDollars:0 });
  const raised = () => DANCERS.reduce((s, d) => s + d.dollars, 0);
  const rankVal = d => EVENT.rankBy === 'votes' ? d.votes : d.dollars;
  const standings = () => [...DANCERS].sort((a, b) => rankVal(b) - rankVal(a));
  const voteTotal = () => DANCERS.reduce((s, d) => s + d.votes, 0);

  const JUDGES = [
    { slug:'derek-brown',   name:'Derek Brown'   },
    { slug:'paul-terry',    name:'Paul Terry'    },
    { slug:'rochelle-lunt', name:'Rochelle Lunt' }
  ];

  // $1 = 1 vote. Single dollar charges are deliberately not sold: Square's
  // fixed 30c would take a third of them. Bundles carry bonus votes instead.
  const BUNDLES = [
    { amt:5,   votes:5,   bonus:'' },
    { amt:20,  votes:25,  bonus:'5 bonus votes' },
    { amt:50,  votes:75,  bonus:'25 bonus votes', best:true },
    { amt:100, votes:175, bonus:'75 bonus votes' }
  ];

  // Square online, Plus plan. Cards and digital wallets only.
  // Cash, cheques and anything taken at a table carry no fee at all.
  const FEE = { pct: 0.029, fixed: 0.30, label: 'Card processing fee' };
  const feeFor = amt => Math.round((amt * FEE.pct + FEE.fixed) * 100) / 100;

  /* ----------------------------------------------------------------
     What the room is allowed to see.

     The Friends board asked for the money to be public and live, but were
     not sure about the standings. So standings are OFF by default: the
     crowd sees the total climbing and the lineup, not who is winning.
     The lead admin can flip either of these mid-event from Controls.

     In production these live on the server and arrive with the poll.
     Here they ride localStorage so the admin panel really does drive the
     voter page and the big screen during a walkthrough.
     ---------------------------------------------------------------- */
  const flag = (key, dflt) => ({
    get()    { try { const v = localStorage.getItem(key); return v === null ? dflt : v === '1'; } catch (e) { return dflt; } },
    set(on)  { try { localStorage.setItem(key, on ? '1' : '0'); } catch (e) {} }
  });
  const DISPLAY = {
    standings : flag('cjc_pub_standings', false),  // ranks and bars, publicly
    dollars   : flag('cjc_pub_dollars',   false),  // per dancer dollar amounts
    voting    : flag('cjc_voting_open',   true),
    power     : flag('cjc_power_hour',    false)
  };

  const photo = d => '../images/people/' + d.slug + '.webp';
  const money = n => '$' + n.toLocaleString('en-US', { minimumFractionDigits:2, maximumFractionDigits:2 });
  const plain = n => '$' + Math.round(n).toLocaleString('en-US');

  return { EVENT, DANCERS, JUDGES, BUNDLES, FEE, DISPLAY, feeFor, raised, voteTotal,
           rankVal, standings, record, paidVotes, totals, photo, money, plain };
})();
