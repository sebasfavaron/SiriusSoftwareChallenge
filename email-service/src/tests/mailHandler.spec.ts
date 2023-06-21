describe('mailHandler', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  describe('GET /stats', () => {
    it('should throw forbidden error if not an admin', async () => {
      // Given
      // When
      // Then
    });

    it('if admin, should return list of users and daily sent mails', async () => {
      // Given
      // When
      // Then
    });
  });

  describe('POST /send-mail', () => {
    it('should send mail if user is authenticated and under the daily quota', async () => {
      // Given
      // When
      // Then
    });

    it('should throw unauthorized error if user does not provide valid JWT token', async () => {
      // Given
      // When
      // Then
    });

    it('should throw error if user authorized but over the daily quota', async () => {
      // Given
      // When
      // Then
    });
  });
});
