FROM mcr.microsoft.com/dotnet/core/sdk:3.1 AS build-env

# Fetch and install Node 10. Make sure to include the --yes parameter 
# to automatically accept prompts during install, or it'll fail.
RUN curl --silent --location https://deb.nodesource.com/setup_10.x | bash -
RUN apt-get install --yes nodejs

# Copy the source from your machine onto the container.
WORKDIR /src
COPY . .

# Install dependencies. 
# https://docs.microsoft.com/en-us/dotnet/core/tools/dotnet-restore?tabs=netcore2x
RUN dotnet restore "./Games.csproj"

# Compile, then pack the compiled app and dependencies into a deployable unit.
# https://docs.microsoft.com/en-us/dotnet/core/tools/dotnet-publish?tabs=netcore21
RUN dotnet publish "Games.csproj" -c Release -o /app/publish

# Build runtime image
FROM mcr.microsoft.com/dotnet/core/aspnet:3.1

ENV PORT 80

# Copy the published app to this new runtime-only container.
COPY --from=build-env /app/publish .

# To run the app, run `dotnet Games.dll`, which we just copied over.
CMD ASPNETCORE_URLS=http://+:$PORT dotnet Games.dll

