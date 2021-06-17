## Prepare for running tests

Start Test Environment using

- `docker-compose up -d`

Start BrowserStackLocal

- `grapedev/enter-runtime.sh`
- get your key from the end to end testing channel https://uebergrape.staging.chatgrape.com/chat/channel/7906:1efae9027eb811e8ac1b0242ac1d0003/
- `BrowserStackLocal --key xxx -d start`

Set the the environment variable to be used by Python

- `export BROWSERSTACK_AUTH_KEY=xxx`

Switch to the end_to_end_tests directory

- `cd end_to_end_tests/`

## Run Tests

Run tests with Default Browser Chrome

`python suite.py`

Run Suite with IE10

`python suite.py -b ie10`

Disover which browser are available

`python suite.py -h`

## Run a single test

python -m unittest <filename>.<classname>.<functionname>

Example

`python -m unittest test_login.TestLogin.test_login`

## Create a new Test

Create a new file in this folder with the following naming pattern: `test_<testing-area>.py`. It will automatically be picked up when running the entire suite.

```py
import utils

class TestTestingArea(utils.TestCase):

    def test_some_description(self):
        self.assertIsNotNone(True)

if __name__ == '__main__':
    unittest.main()
```

Further resources how to find, check for elements, type into inputs and so and can be found in the official docs [https://selenium-python.readthedocs.io/](https://selenium-python.readthedocs.io/).
