import utils


class TestLogin(utils.TestCase):

    def test_login(self):
        utils.login_user(self.driver)

        # find team
        team_name = self.driver.find_element_by_xpath(
            "//*[contains(text(), 'New Conversation')]")
        self.assertIsNotNone(team_name)
