import './App.sass';
import { Button } from 'components/Button';
import { ReactComponent as CopyIcon } from 'assets/icons/copy.svg';
import { ReactComponent as MoonIcon } from 'assets/icons/moon.svg';
import { ReactComponent as SunIcon } from 'assets/icons/sun.svg';
import { Input } from 'components/Input';
import { Toggle } from 'components/Toggle';
import { Slider } from 'components/Slider';
import { InputGroup } from 'components/InputGroup';
import { useState } from 'react';
import { useTheme } from 'helpers/ThemeProvider/lib/useTheme';
import { classNames } from 'helpers/classNames';
import { Checkbox } from 'components/Checkbox';

function App() {
  const { theme, toggleTheme } = useTheme();
  const [pwd, setPwd] = useState('');
  const [lowerChar, setLowerChar] = useState(true);
  const [upperChar, setUpperChar] = useState(true);
  const [specialChar, setSpecialChar] = useState(true);
  const [numberChar, setNumberChar] = useState(true);
  const [length, setLength] = useState(20);
  const [showTooltip, setShowTooltip] = useState(false);

  const [numberOfUids, setNumberOfUids] = useState(1);
  const [uids, setUids] = useState('');
  const [showTooltipUid, setShowTooltipUid] = useState(false);

  const getArrayCharacters = (low: number, high: number): string[] => {
    const result = new Array(high - low);
    for (let i = 0, l = low; i <= high - low; i++) {
      result[i] = String.fromCharCode(l++);
    }
    return result;
  };

  const SYMBOLS = Array.from('!"#$%&\'()*+,-./:;<=>?@[]^_`{|}~');
  const UPPERCASES = getArrayCharacters(65, 90);
  const LOWERCASES = getArrayCharacters(97, 122);
  const NUMBERS = getArrayCharacters(48, 57);

  const getRandomNumber = (min: number, max: number): number => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
  };

  interface GenerateProps {
    len: number;
    hasNumbers: boolean;
    hasSpec: boolean;
    hasLower: boolean;
    hasUpper: boolean;
  }

  const generate = (props: GenerateProps): string => {
    const { len, hasNumbers, hasSpec, hasLower, hasUpper } = props;
    let charsArray: string[] = [];
    const condsAndChars: { cond: boolean; chars: string[] }[] = [
      { cond: hasLower, chars: LOWERCASES },
      { cond: hasUpper, chars: UPPERCASES },
      { cond: hasNumbers, chars: NUMBERS },
      { cond: hasSpec, chars: SYMBOLS },
    ];
    for (const { cond, chars } of condsAndChars) {
      if (cond) charsArray = [...charsArray, ...chars];
    }
    const password = Array.from(
      { length: len },
      () => charsArray[getRandomNumber(0, charsArray.length)]
    );
    for (const { cond, chars } of condsAndChars) {
      if (!cond) continue;
      const passHasChar = password.some((char) => chars.includes(char));
      if (!passHasChar) return generate(props);
    }
    return password.join('');
  }

  const lowerCharChange = () => {
    setLowerChar(!lowerChar);
  }
  const upperCharChange = () => {
    setUpperChar(!upperChar);
  }
  const numberCharChange = () => {
    setNumberChar(!numberChar);
  }
  const specialCharChange = () => {
    setSpecialChar(!specialChar);
  }
  const lengthChange = (value: number | number[]) => {
    setLength(value as number);
  }
  const numberOfUidsChange = (value: number | number[]) => {
    setNumberOfUids(value as number);
  }

  const generateClick = () => {
    const props = {
      len: length,
      hasLower: lowerChar,
      hasNumbers: numberChar,
      hasSpec: specialChar,
      hasUpper: upperChar
    };

    setPwd(generate(props));
  }

  const copyClick = () => {
    setShowTooltip(true);
    navigator.clipboard.writeText(pwd)
      .then(() => {
        setTimeout(() => {
          setShowTooltip(false);
        }, 500);
      })
      .catch(err => {
        console.log('Cant copy password', err);
      });
  }
  const copyUIDClick = () => {
    setShowTooltipUid(true);
    navigator.clipboard.writeText(uids)
      .then(() => {
        setTimeout(() => {
          setShowTooltipUid(false);
        }, 500);
      })
      .catch(err => {
        console.log('Cant copy password', err);
      });
  }

  const getRandom128Bit = () => {
    let bit = [];
    for (let i = 0; i < 128; i++) {
      bit.push(Math.round(Math.random()));
    }
    return bit;
  }

  const generateUid = () => {
    // 8-4-4-4-12
    // AAAA AAAA - AAAA - MAAA - NAAA- AAAA AAAA AAAA
    // M - version, N - variable
    let uidBinary = getRandom128Bit();
    uidBinary[48] = 0;
    uidBinary[49] = 1;
    uidBinary[50] = 0;
    uidBinary[51] = 0;

    uidBinary[64] = 1;
    uidBinary[65] = 0;

    let res = "";
    for (let i = 0; i < 128; i += 4) {
      let bit4 = `${uidBinary[i]}${uidBinary[i + 1]}${uidBinary[i + 2]}${uidBinary[i + 3]}`
      res += parseInt(bit4, 2).toString(16)
      if (i === 28 || i === 44 || i === 60 || i === 76) {
        res += "-"
      }
    }
    return res;
  }

  const generateUidsClick = () => {
    let res = '';
    for (let i = 0; i < numberOfUids; i++) {
      res += generateUid() + '\n';
    }

    setUids(res);
  }

  return (
    <div className={classNames('app', {}, [theme])}>
      <div></div>
      <div className="theme-wrapper">
        <SunIcon width={25} height={25} fill="var(--fg-brand-primary)" />
        <Toggle className='toggleTheme' size='L' checked={theme === 'dark'} onClick={toggleTheme} />
        <MoonIcon width={25} height={25} fill="var(--fg-brand-primary)" />
      </div>

      <Toggle className='toggleTheme' size='M' checked={theme === 'dark'} onClick={toggleTheme} />
      <Toggle className='toggleTheme' size='L' disabled checked={theme === 'dark'} onClick={toggleTheme} />
      <Toggle className='toggleTheme' size='M' disabled checked={theme === 'dark'} onClick={toggleTheme} />
      <div className="wrapper">
        <div className="prop-wrapper">
          <h1 className="header">Password generator</h1>

          <div className="prop">
            <Checkbox className="checkbox" size='XL' checked={lowerChar} onChange={lowerCharChange} />
            <label>Lowercase characters</label>
          </div>
          <div className="prop">
            <Checkbox className="checkbox" size='XL' checked={upperChar} onChange={upperCharChange} />
            <label>Uppercase characters</label>
          </div>
          <div className="prop">
            <Checkbox className="checkbox" size='XL' checked={numberChar} onChange={numberCharChange} />
            <label>Number characters</label>
          </div>
          <div className="prop">
            <Checkbox className="checkbox" size='XL' checked={specialChar} onChange={specialCharChange} />
            <label>Special characters</label>
          </div>
          <div className="prop">
            <Slider

              text='bottom'
              label="Opacity"
              maxValue={256}
              minValue={4}
              type='single'
              value={length}
              step={1}
              onChange={lengthChange}
            />
          </div>
          <Button className='button' theme='primary' onClick={generateClick}>Generate</Button>
        </div>

        <div className="input-wrapper">
          {showTooltip && <div className="tooltip">Copied!</div>}
          <InputGroup className='input-group'>
            <Input placeholder='Password' value={pwd} />
            <Button className='input-button' theme='outline' onClick={copyClick}>
              <CopyIcon />
              <span className='input-button-text'>Copy</span>
            </Button>
          </InputGroup>
        </div>

        <div className="prop-wrapper">
          <h1 className="header">UIDs generator</h1>
          <Slider

            text='bottom'
            label="Opacity"
            maxValue={1000}
            minValue={1}
            type='single'
            value={numberOfUids}
            step={1}
            onChange={numberOfUidsChange}
          />
          <Button className='button' theme='primary' onClick={generateUidsClick}>Generate {numberOfUids} UIDs</Button>

          <div className="input-wrapper">
            {showTooltipUid && <div className="tooltip area">Copied!</div>}
            <InputGroup className='input-group input-area'>
              <Input area placeholder='UIDs' value={uids} />
              <Button className='input-button' theme='outline' onClick={copyUIDClick}>
                <CopyIcon />
                <span className='input-button-text'>Copy</span>
              </Button>
            </InputGroup>
          </div>
        </div>

      </div>



    </div>
  );
}

export default App;
