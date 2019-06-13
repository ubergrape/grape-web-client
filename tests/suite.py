import unittest
import argparse

targets = {
    'ie10': {
        'browser': 'IE',
        'browser_version': '10.0',
        'os': 'Windows',
        'os_version': '8',
    },
    'ie11': {
        'browser': 'IE',
        'browser_version': '11.0',
        'os': 'Windows',
        'os_version': '10',
    },
    'chrome': {
        'browser': 'Chrome',
        'browser_version': '62.0',
        'os': 'Windows',
        'os_version': '10',
    },
    'safari': {
        'browser': 'Safari',
        'browser_version': '11.1',
        'os': 'OS X',
        'os_version': 'High Sierra',
    }
}

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Run the End-to-End Tests.')
    parser.add_argument('-b', '--browser', default='chrome',
                        choices=['ie10', 'ie11', 'safari', 'chrome'],
                        help='Choose a browser target.')

    args = parser.parse_args()
    loader = unittest.TestLoader()
    suite = loader.discover('.')

    for testModule in suite:
        for testClass in testModule:
            try:
                for test in testClass._tests:
                    target = targets[args.browser]
                    test.desired_cap['browser'] = target['browser']
                    test.desired_cap['browser_version'] = target['browser_version']
                    test.desired_cap['os'] = target['os']
                    test.desired_cap['os_version'] = target['os_version']
            except AttributeError:
                print("Error exexcuting tests in {}".format(testClass))

    unittest.TextTestRunner().run(suite)
