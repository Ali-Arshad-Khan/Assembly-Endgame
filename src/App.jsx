import { useState } from 'react'
import { languages } from './languages'
import { getFarewellText, randomWord } from './utils'
import clsx from 'clsx';
import Confetti from "react-confetti"
import './App.css'

function App() {

  const [currentWord, setCurrentWord] = useState(() => randomWord())
 
  const [guessedLetter, setGuessedLetter] = useState([])


  function guessedLetterClick(alpha) {
    setGuessedLetter( prevLetter => (
        prevLetter.includes(alpha) ? prevLetter : [...prevLetter, alpha]
    )
    )
  }

  function newGame() {
    setCurrentWord(randomWord())
    setGuessedLetter([])
  }


  const numberGuessesLeft = languages.length - 1

  const wrongCount = guessedLetter.filter(letter => !currentWord.includes(letter)).length

  const isGameWon = currentWord.split("").every(letter => guessedLetter.includes(letter))

  const isGameLost = wrongCount >= languages.length

  const isGameOver = isGameWon || isGameLost
  
  const lastGuessedLetter = guessedLetter[guessedLetter.length-1]
  
  const isLastGuessedIncorrect = lastGuessedLetter && !currentWord.includes(lastGuessedLetter)

  const alphabet = "abcdefghijklmnopqrstuvwxyz";


  const keyboard = alphabet.split("").map(alpha => { 
    
    const isGuessed = guessedLetter.includes(alpha)
    const isCorret = isGuessed && currentWord.includes(alpha)
    const isWrong = isGuessed && !currentWord.includes(alpha)

    const className = clsx({
      correct: isCorret,
      wrong: isWrong,
      

    })


    return (
    <button 
    key={alpha+1} 
    disabled={isGameOver} 
    aria-disabled={guessedLetter.includes(alpha)}
    aria-label={`Letter ${alpha}`}
    onClick={() => guessedLetterClick(alpha)} className={className}>{alpha}
    </button>
    )})

  const current = currentWord.split("");
  
  const wordBoxes = current.map((cur,index) => { 
    const shouldRevealLetter = isGameLost || guessedLetter.includes(cur) ? cur : ""
    const letterClassName = clsx(
       isGameLost && !guessedLetter.includes(cur) && "missed-letter"
    )
    return (
    <span key={index} className={letterClassName}>{shouldRevealLetter}</span>
  )})

  const languageElements = languages.map((lang, index) => {
    
    const isLanguageLost = wrongCount > index
    
    return (
      <span key={lang.name} className={`lang ${isLanguageLost?'lost':''}`} style={{
      backgroundColor:`${lang.backgroundColor}`,
      color:`${lang.color}`
    }}>{lang.name}</span>


  )})

  const gameStatusClass = clsx("game-status" , {
    won: isGameWon,
    lost: isGameLost,
    farewell: !isGameOver && isLastGuessedIncorrect
  })

  function renderGameStatus() {
        if (!isGameOver && isLastGuessedIncorrect) {
            return <p className="farewell-message">
              {getFarewellText(languages[wrongCount - 1].name)}
              </p>
        }

        if (isGameWon) {
            return (
                <>
                    <h1>You win!</h1>
                    <p>Well done! 🎉</p>
                </>
            )
        }
        if (isGameLost) {
            return (
                <>
                    <h1>Game over!</h1>
                    <p>You lose! Better start learning Assembly 😭</p>
                </>
            )
        }

        return null

    }

  return (
    <main>
      { isGameLost && <>
   <div class="emoji e1"></div>
  <div class="emoji e2"></div>
  <div class="emoji e3"></div>
  <div class="emoji e4"></div>
  <div class="emoji e5"></div>
  <div class="emoji e6"></div>
  <div class="emoji e7"></div>
  <div class="emoji e8"></div>
  <div class="emoji e9"></div>
  <div class="emoji e10"></div>
      </>}

      <div className="confetti-center">
   {isGameWon &&< Confetti width={400} height={300} />}
    </div>
      <header>
      <h1>Assembly: Endgame</h1>
      <p>Guess the word in under 8 attempts to keep the programming world safe from Assembly!</p>
      </header>
      <section aria-live="polite" role="status" className={gameStatusClass}>
        {renderGameStatus()} 
      </section>
      <section className="languages">
      {languageElements}
      </section>
      <section className="word-box">
        {wordBoxes}
      </section>

       {/* Combined visually-hidden aria-live region for status updates */}
       <section 
                className="sr-only" 
                aria-live="polite" 
                role="status"
            >
                <p>
                    {currentWord.includes(lastGuessedLetter) ? 
                        `Correct! The letter ${lastGuessedLetter} is in the word.` : 
                        `Sorry, the letter ${lastGuessedLetter} is not in the word.`
                    }
                    You have {numberGuessesLeft} attempts left.
                </p>
                <p>Current word: {currentWord.split("").map(letter => 
                guessedLetter.includes(letter) ? letter + "." : "blank.")
                .join(" ")}</p>
            
        </section>


      <section className="keyboard">
        {keyboard}
      </section>
      {isGameOver && <button className="new-game"  onClick={newGame}>
        New Game
      </button>}
      {!isGameOver && <p className='guesses-left'>Number of guesses left : <span>{(numberGuessesLeft+1)-wrongCount}</span></p>}
    </main>
  )
}

export default App
